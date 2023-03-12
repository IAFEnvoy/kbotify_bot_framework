const fs = require('fs');
const { sendText, sendImg } = require('./util.cjs');

const url = 'http://127.0.0.1:23168';

const onMessage = async (client, e) => {
    let message = e.content;
    if (message == null) return;
    let ms = message.split(' ');
    if (ms[0] == '!hyp' && ms.length == 2) {
        sendText(client, e.channelId, `请使用#hyp`);
    }
    if (ms[0] == '!bw' && ms.length == 2) {
        sendText(client, e.channelId, `请使用#hyp`);
    }
    if (ms[0] == '!sw' && ms.length == 2) {
        sendText(client, e.channelId, `请使用#hyp`);
    }
    if (ms[0] == '#hyp') {
        try {
            let ping = await fetch(url).then(res => res.text());
            if (ping != '200 OK') return sendText(client, e.channelId, '无法连接到后端服务，请联系作者');
            if (ms.length == 1) {
                let data = await fetch(`${url}/type`).then(res => res.json());
                let res = '指令：#hyp <playername> (<type>) (<mode>)\n当前支持的分类：'
                Object.keys(data).forEach(x => {
                    res += `\n#${x}`;
                    let mode = Object.keys(data[x]);
                    if (mode.length != 0)
                        res += ` (${mode.join(',')})`;
                });
                sendText(client, e.channelId, res);
            }
            let id = ms[1];
            if (ms.length == 2) {
                let data = await fetch(`${url}/hyp?name=${id}`).then(res => res.json());
                if (data.statusCode == 200 && fs.existsSync(data.data))
                    sendImg(client, e.channelId, data.data);
                else
                    sendText(client, e.channelId, `获取失败：${data.reason}`);
            }
            if (ms.length == 3 || ms.length == 4) {
                let data = await fetch(`${url}/${ms[2]}?name=${id}${ms[3] == null ? '' : `&mode=${ms[3]}`}`).then(res => res.json());
                if (data.statusCode == 200 && fs.existsSync(data.data))
                    sendImg(client, e.channelId, data.data);
                else if (data.statusCode == 404)
                    sendText(client, e.channelId, `获取失败：分类不存在，请使用#hyp查看用法`);
                else
                    sendText(client, e.channelId, `获取失败：${data.reason}`);
            }
        } catch (err) {
            console.log(err);
        }
    }
}

const config = {
    id: 'hypixel-img',
    name: 'Hypixel卡片查询',
    menu: '#hyp <playername> (<type>) (<mode>) Hypixel卡片查询'
};

module.exports = { config, onMessage };