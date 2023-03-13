const fs = require('fs');
const { sendText, sendImg } = require('./util.cjs');

let memeList = [];
let cooldown = {};

const onMessage = (client, event) => {
    if (event.content == '来张梗图') {
        let date = new Date().getTime();
        if (date - (cooldown[event.channelId] ?? 0) < 20 * 1000) return sendText(client, event.channelId, `技能冷却中(～￣▽￣)～[${20 - Math.round((date - cooldown[event.channelId] ?? 0) / 1000)}s]`);
        cooldown[event.channelId] = date;
        let s = memeList[Math.floor(Math.random() * memeList.length)];
        console.log(s);
        sendImg(client, event.channelId, './src/img/meme/' + s);
    }
}

const onLoad = (config, client) => {
    memeList = [];
    fs.readdir('./src/img/meme', (err, files) => {
        if (err)
            return console.log(err);
        memeList = files;
    });
}

const config = {
    id: 'meme',//必选
    name: '梗图',//必选
    menu: '来张梗图 发送一张图'
};

module.exports = { config, onMessage, onLoad };