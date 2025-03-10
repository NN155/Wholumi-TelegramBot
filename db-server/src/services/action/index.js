const User = require('../../models/User');

class ActionService {
    async userAccess({ user, role, telegramId, action }) {
        if (role.role === 'admin') {
            return { access: true };
        }

        if (user?.isBanned === true) {
            
            if (user.banType === 'permanent') {
                return { 
                    access: false, 
                    reason: 'Permanently banned',
                    message: "You have a permanent ban" 
                };
            }
    
            if (user.banType === 'temporary' && user.banExpireDate) {
                const currentTime = new Date();
                const banExpireDate = new Date(user.banExpireDate);
    
                if (currentTime < banExpireDate) {
                    const timeLeftMinutes = Math.ceil((banExpireDate - currentTime) / 1000 / 60);
                    const formattedTime = this._formatTimeLeft(timeLeftMinutes);
                    
                    return {
                        access: false,
                        reason: 'Temporarily banned',
                        message: `You have a temporary ban for ${formattedTime}`,
                        expireDate: banExpireDate,
                        timeLeft: {
                            minutes: timeLeftMinutes,
                            formatted: formattedTime
                        }
                    };
                } else {
                    await this.unban({ telegramId });
                    return { access: true, wasUnbanned: true };
                }
            }
        }
        const permissions = role.get('permissions');
        const access = permissions.includes(action);
        return { access, message: access ? "" : "You don't have enough permission" };
    }

    async ban({ telegramId, telegramUsername, banType, banDuration }) {
        let user = await User.findOne({ telegramId });
        if (!user) {
            user = await this._createUser({
                telegramId,
                telegramUsername,
            });
        }

        if (user.role === 'admin') {
            return { success: false, message: 'Admin cannot be banned' };
        }

        if (user.isBanned && user.banType === 'permanent') {
            return {
                success: false,
                message: 'User already has permanent ban'
            };
        }

        user.isBanned = true;
        user.banType = banType;
        user.telegramUsername = telegramUsername || user.telegramUsername;

        if (banType === 'temporary' && banDuration) {
            user.banExpireDate = new Date(Date.now() + Math.min(banDuration * 60 * 1000, 1000 * 60 * 60 * 24 * 30));
        } else {
            user.banExpireDate = null;
        }

        await user.save();
        return {
            success: true,
            message: `User banned ${banType === 'temporary' ? 'temporarily' : 'permanently'}`,
            banInfo: banType === 'temporary' ? {
                expiresAt: user.banExpireDate
            } : {
                permanent: true
            }
        };
    }

    async unban({ telegramId, permanent = false }) {
        const user = await User.findOne({ telegramId });
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (!user.isBanned) {
            return { 
                success: false, 
                message: 'User is not banned', 
            };
        }
        if (user.banType === 'permanent' && !permanent) {
            return {
                success: false,
                message: "You don't have enough permission to unban permanently banned user"
            }
        };
        user.isBanned = false;
        user.banType = null;
        user.banExpireDate = null;
        await user.save();
        return { success: true, message: 'User unbanned' };
    }

    async status({ telegramId }) {
        const user = await User.findOne({ telegramId });

        if (!user) {
            return {
                success: false,
                message: 'User not found'
            };
        }

        let banStatus = 'Not banned';
        let timeLeft = null;

        if (user.isBanned) {
            if (user.banType === 'permanent') {
                banStatus = 'Permanently banned';
            } else if (user.banType === 'temporary' && user.banExpireDate) {
                const currentTime = new Date();
                const banExpireDate = new Date(user.banExpireDate);

                if (currentTime > banExpireDate) {
                    await this.unban({ telegramId });
                    banStatus = 'Not banned (recently unbanned)';
                } else {
                    const remainingMinutes = Math.ceil((banExpireDate - currentTime) / 1000 / 60);
                    timeLeft = {
                        minutes: remainingMinutes,
                        formatted: this._formatTimeLeft(remainingMinutes)
                    };
                    banStatus = `Temporarily banned for ${timeLeft.formatted}`;
                }
            }
        }
        return {
            success: true,
            message: 
`Role: ${user.role || 'visitor'}
Ban status: ${banStatus}`,
            userInfo: {
                telegramId: user.telegramId,
                telegramUsername: user.telegramUsername,
                role: user.role || 'visitor',
                banStatus: banStatus,
                timeLeft: timeLeft
            }
        };
    }
    async _createUser({ telegramId, telegramUsername = null, ...rest }) {
        return await User.create({ ...rest, telegramId, telegramUsername });
    }

    _formatTimeLeft(minutes) {
        if (minutes < 60) {
            return `${minutes} min`;
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours < 24) {
            let result = `${hours} h`;
            if (remainingMinutes > 0) {
                result += ` ${remainingMinutes} min`;
            }
            return result;
        }

        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;

        if (days < 30) {
            let result = `${days} d`;
            if (remainingHours > 0) {
                result += ` ${remainingHours} h`;
            }
            return result;
        }

        const months = Math.floor(days / 30);
        const remainingDays = days % 30;

        if (months < 12) {
            let result = `${months} mon`;
            if (remainingDays > 0) {
                result += ` ${remainingDays} d`;
            }
            return result;
        }

        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let result = `${years} y`;
        if (remainingMonths > 0) {
            result += ` ${remainingMonths} mon`;
        }
        return result;
    }
}

module.exports = new ActionService();