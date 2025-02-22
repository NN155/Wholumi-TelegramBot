class ClubServices {
    async dailyBoost({data, count}) {
        const response = await fetch(`${process.env.MAIN_SERVER_URL}/extension/club/daily/boost`, {
            method: 'POST',
            body: JSON.stringify({data, count}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.text();
    }
}

module.exports = new ClubServices();