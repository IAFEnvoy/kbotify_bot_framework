const fs = require('fs');
const path = require('path');

const log = (text) => console.log(`[${new Date().toLocaleString()}] ${text}`);
const sendText = (client, target, text) => {
    log(`-> [${target}] ${text}`);
    client.API.message.create(1, target, text)
};
const sendImg = async (client, target, img) => {
    let url = await client.API.asset.create(fs.readFileSync(img), {
        filename: path.basename(img),
        filepath: path.dirname(img)
    }).then(res => res.url).catch(err => log(err));
    log(`-> [${target}] ${url}`);
    client.API.message.create(2, target, url);
};

module.exports = { sendText, sendImg, log };