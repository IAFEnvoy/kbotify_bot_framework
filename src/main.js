const { KBotify } = require('kbotify');
const fs = require('fs');
const { log, sendText, sendImg } = require('./util');
const config = require('./config');
const { BotPluginManager } = require('./plugin');

console.log(`${fs.readFileSync('./src/logo.txt')}`);//打印logo，此处进行Buffer强制类转
//初始化
config.load();
const c = config.getConfig();
let ops = c.ops;

const client = new KBotify({
    mode: 'websocket',
    token: c.token,
    ignoreDecryptError: false, // 是否忽略消息解密错误 如果需要可以改为true
});

let pluginManager = new BotPluginManager();
pluginManager.load(c, client);


client.message.on('text', async (e) => {
    log(`<- ${e.author.nickname}(${e.author.id}) [${e.channelName}] ${e.content}`);
    let message = e.content;

    if (ops.find(op => op == e.author.id) != null)
        pluginManager.runManagerEvent(client, e, c);

    if (message == '菜单' || message == '/help')
        sendText(client, e.channelId, pluginManager.getMenu(e.group_id));

    pluginManager.onMessage(client, e);

    if (e.type == 9 && !e.author.bot) {

    }
});

client.connect(); // 启动 Bot 

log('Bot Connected');