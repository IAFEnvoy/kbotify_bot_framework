const serverInfo = require('mc-server-status');
const { sendText, sendImgWithUrl } = require('./util.cjs');

const onMessage = async (client, event) => {
    let message = event.content;
    let ms = message.split(' ');
    if (ms[0] == '/mcping' && ms.length == 2) {
        try {
            let res = await serverInfo.getStatus(ms[1].split(":")[0], ms[1].split(':')[1]);
            if (res == null) return sendText(client, event.channelId, '查询超时！');
            let s = `服务器地址：${ms[1]}\n`;
            s += `描述：${res.description.extra == null ? res.description : res.description.extra.reduce((p, c) => p + c.text, '')}\n`;
            s += `版本：${res.version.name}\n`;
            s += `延迟：${res.ping}ms\n`;
            s += `玩家数量：${res.players.online}/${res.players.max}`;
            sendText(client, event.channelId, s);
        } catch (err) {
            return sendText(client, event.channelId, '查询超时！');
        }
    }
    if (ms[0] == '/mcskin' && ms.length == 2) {
        try {
            let name = ms[1];
            let a = await fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`)
                .catch(err => { throw err })
                .then(res => res.json());
            let uuid = a.id;
            sendImgWithUrl(client, event.channelId, `https://crafatar.com/renders/body/${uuid}?overlay`, `./src/temp/minecraft/body/${uuid}.png`);
        } catch (err) {
            console.log(err);
            sendText(client, event.channelId, '未找到此玩家，请确认是否拼写错误');
        }
    }
    if (ms[0] == '/mchead' && ms.length == 2) {
        try {
            let name = ms[1];
            let a = await fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`)
                .catch(err => { throw err })
                .then(res => res.json());
            let uuid = a.id;
            sendImgWithUrl(client, event.channelId, `https://crafatar.com/renders/head/${uuid}?overlay`, `./src/temp/minecraft/head/${uuid}.png`);
        } catch (err) {
            sendText(client, event.channelId, '未找到此玩家，请确认是否拼写错误');
        }
    }
    if (ms[0] == '/mcavatar' && ms.length == 2) {
        try {
            let name = ms[1];
            let a = await fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`)
                .catch(err => { throw err })
                .then(res => res.json());
            let uuid = a.id;
            sendImgWithUrl(client, event.channelId, `https://crafatar.com/avatars/${uuid}?overlay`, `./src/temp/minecraft/avatars/${uuid}.png`);
        } catch (err) {
            sendText(client, event.channelId, '未找到此玩家，请确认是否拼写错误');
        }
    }
}

const config = {
    id: 'minecraft',//必选
    name: 'MC工具箱',//必选
    menu: '/mcping <ip> 查服'
};

module.exports = { config, onMessage };