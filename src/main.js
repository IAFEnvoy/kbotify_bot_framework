const KookBot = require('kook-bot-ts').KookBot;
const fs = require('fs');

console.log(`${fs.readFileSync('./src/logo.txt')}`);//打印logo，此处进行Buffer强制类转

const bot = new KookBot({
    token: '1/MTU5NTU=/ojQGE+xevoxNB60WZrJm+g==',
    plugin_folder: './src/plugins/',
    ops: [2852054623],
    debug_command: true,
    enable_ticket_system: true
})

bot.connect();