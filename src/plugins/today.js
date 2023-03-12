const fs = require('fs');
const { sendText, sendImg } = require('./util.cjs');

let todayJson = {};

const loadTodayConfig = () => {
    if (fs.existsSync('./config/today.json'))
        todayJson = JSON.parse(fs.readFileSync('./config/today.json', 'utf8'));
}

const saveTodayConfig = () => {
    fs.writeFileSync('./config/today.json', JSON.stringify(todayJson));
}

const today = (user_id) => {
    if (todayJson[user_id]?.karma == null)
        todayJson[user_id] = {};
    else if (datesAreOnSameDay(todayJson[user_id].last, new Date().getTime()))
        return todayJson[user_id].karma;
    todayJson[user_id].karma = Math.ceil(Math.random() * 100);
    todayJson[user_id].last = new Date().getTime();
    return todayJson[user_id].karma;
}

const datesAreOnSameDay = (f, s) => {
    const first = new Date(f), second = new Date(s);
    return first.getFullYear() == second.getFullYear() &&
        first.getMonth() == second.getMonth() &&
        first.getDate() == second.getDate();
}

const onMessage = (client, e) => {
    let message = e.content;
    if (message == '/today') {
        if (new Date().getDay() == 4) {
            sendText(client, e.channelId, '今天疯狂星期四，v我50');
            return;
        }
        sendText(client, e.channelId, `您今日的人品是${today(e.author.id)}`);
        sendText(client, e.channelId, '此功能即将停用，请使用/luck');
        saveTodayConfig();
    }
}

const onLoad = (config, client) => {
    loadTodayConfig();
}

const config = {
    id: 'today',
    name: '每日人品',
    menu: '/today 每日人品',
    default_permission: true
};

module.exports = { config, onMessage, onLoad };