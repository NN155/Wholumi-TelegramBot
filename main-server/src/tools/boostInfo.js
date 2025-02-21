function getCardWord(value) {
    if (value % 10 === 1 && value % 100 !== 11) {
        return "карту";
    } else if ([2, 3, 4].includes(value % 10) && ![12, 13, 14].includes(value % 100)) {
        return "карты";
    }
    return "карт";
}

function getAvailableWord(value) {
    if (value % 10 === 1 && value % 100 !== 11) {
        return "доступной";
    }
    return "доступных";
}

function formatResultString(place, username, boosted, cardWord, count, availableWord) {
    let prefix = place === 1 ? '👑 ' : '';
    let specialKey = username === "Nubitos" ? `Угувей ~${username}~ Оки верни сотку - ` : `${username} - `;
    return `${prefix}${place}. ${specialKey}${boosted} ${cardWord} из ${count} ${availableWord}`;
}

function generateResultString({data, count, users}) {
    const sortedUsers = [...data].sort((a, b) => b.boosted - a.boosted);

    let resultString = `По итогам сегодняшней сдачи:

• ────── ✾ ────── •
    *Насчитано карт: ${count}* 
• ────── ✾ ────── •
    
${sortedUsers.map((user, index) => {
    const place = index + 1;
    let prefix = place === 1 ? '👑 ' : '';
    const cardWord = getCardWord(user.boosted);
    const availableWord = getAvailableWord(user.count);

    const userInfo = users.find(u => u.name === user.name)
    let name = user.name
    userInfo?.prefix && (name = `${userInfo.prefix}${name}`);
    userInfo?.suffix && (name = `${name}${userInfo.suffix}`);      

    return `${prefix}${place}. ${name} - ${user.boosted} ${cardWord} из ${user.count} ${availableWord}`;
}).join("\n")}

• ────── ✾ ────── •
Под доступными картами имеются в виду карты, которые бот смог отследить. *Возможны отклонения от реальных цифр!*
• ────── ✾ ────── •`;
    return resultString;
}

module.exports = {
    generateResultString
};