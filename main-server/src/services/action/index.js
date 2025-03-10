class ActionService {
    constructor () {
        this.isWorking = null;
        this.timeFinish = null;
    }
    async searchCards({chatId, threadId, messageId, action}) {
        const data = await this.getOption("SearchCards");
        const option = data.optionValue[process.env.MODE];
        if (!option.active) {
            await this._sendBack({chatId, threadId, messageId, text: 'Module is offed'});
            return;
        }
        const workingTime = option.noWorkTime
        const { success, minutes } = this._isWorkingTime(workingTime);
        if (!success) {
            await this._sendBack({chatId, threadId, messageId, text: `Technical break. Please try again in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.`});
            return;
        }
        if (this.isWorking) {
            await this._sendBack({chatId, threadId, messageId, text: 'I`m working now, please wait a bit'});
            return;
        }
        if (this.timeFinish) {
            const time = this.timeFinish + (option.cooldown * 1000) - Date.now();
            if (time > 0) {
                await this._sendBack({chatId, threadId, messageId, text: `Wait ${Math.ceil(time / 1000)} seconds`});
                return;
            }
        }
        this.isWorking = {chatId, threadId, messageId, action: action.action, taskId: Date.now()};
        await this.sendAction('searchCards', action, this.isWorking.taskId);
    }

    async _sendModuleOffed({chatId, threadId, messageId}) {
        await fetch(`${process.env.TELEGRAM_SERVER_URL}/telegram/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({chatId, threadId, text: 'Module is offed', replyToMessageId: messageId}),
        });
    }
    async getOption(optionName) {
        const response = await fetch(`${process.env.DB_SERVER_URL}/option?optionName=${optionName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    }


    async sendAction( action, data, taskId ) {
        console.log("Main server: send action", action, data);
        await fetch(`${process.env.EXTENSION_SERVER_URL}/action/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: action,
                data: data,
                taskId
            }),
        });
    }

    async results(data) {
        const {threadId, chatId, messageId, action, taskId} = this.isWorking;
        if (taskId !== data.taskId) {
            return;
        }
        this.isWorking = null;
        if (data.error) {
            if (data.error === 'Cards not found') {
                this.timeFinish = Date.now();
            }
            await this._sendBack({threadId, chatId, messageId, text: data.error});
            return;
        }
        this.timeFinish = Date.now();
        const {url} = await this._processData(data, action);
        console.log("Results url", url);
        await this._sendBack({threadId, chatId, messageId, text: url});
    }

    async _sendBack({chatId, threadId, messageId, text}) {
        await fetch(`${process.env.TELEGRAM_SERVER_URL}/telegram/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({chatId, threadId, text: text, replyToMessageId: messageId}),
        });
    }

    async _processData(data, action) {
        const response = await fetch(`${process.env.HOST_SERVER_URL}/engine/generators/genRouter.php`, {
            method: 'POST',
            body: JSON.stringify({
                action,
                data: data.cards,
                info: data.info,
                superSecretKey: process.env.SECRET_KEY
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    }

    _isWorkingTime(noWorkTimePeriods) {
        // Якщо немає періодів або невірний формат
        if (!noWorkTimePeriods || !Array.isArray(noWorkTimePeriods) || noWorkTimePeriods.length === 0) {
            return { success: true, minutes: 0 };
        }
        
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTimeMinutes = currentHours * 60 + currentMinutes;
        
        // Для кожного періоду перевіряємо, чи знаходимося ми зараз в неробочий час
        for (const period of noWorkTimePeriods) {
            // Перевіряємо чи період має правильний формат
            if (!period.start || !period.end) {
                continue;
            }
            
            // Парсимо час початку і кінця періоду
            const [startHours, startMinutes] = period.start.split(':').map(Number);
            const startNoWorkMinutes = startHours * 60 + startMinutes;
            
            const [endHours, endMinutes] = period.end.split(':').map(Number);
            const endNoWorkMinutes = endHours * 60 + endMinutes;
            
            let isInNoWorkPeriod = false;
            let minutesLeft = 0;
            
            if (startNoWorkMinutes <= endNoWorkMinutes) {
                // Простий випадок: неробочий час в межах одного дня
                isInNoWorkPeriod = currentTimeMinutes >= startNoWorkMinutes && currentTimeMinutes < endNoWorkMinutes;
                
                if (isInNoWorkPeriod) {
                    minutesLeft = endNoWorkMinutes - currentTimeMinutes;
                    return { success: false, minutes: minutesLeft };
                }
            } else {
                // Складний випадок: неробочий час переходить через північ
                isInNoWorkPeriod = currentTimeMinutes >= startNoWorkMinutes || currentTimeMinutes < endNoWorkMinutes;
                
                if (isInNoWorkPeriod) {
                    if (currentTimeMinutes >= startNoWorkMinutes) {
                        // Поточний час після початку неробочого часу, рахуємо хвилини до півночі і далі до кінця неробочого часу
                        minutesLeft = (24 * 60 - currentTimeMinutes) + endNoWorkMinutes;
                    } else {
                        // Поточний час до кінця неробочого часу
                        minutesLeft = endNoWorkMinutes - currentTimeMinutes;
                    }
                    return { success: false, minutes: minutesLeft };
                }
            }
        }
        
        // Якщо ми не знаходимося в жодному з неробочих періодів
        return { success: true, minutes: 0 };
    }
}

module.exports = new ActionService();