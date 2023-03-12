const fs = require('fs');
const FILE_PATH = './main.json';

let config = {};

const load = () => {
    if (fs.existsSync(FILE_PATH))
        config = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    else {
        genEmpty();
        save();
        console.log('未检测到主配置文件，已新建文件到./main.json，请填写完再启动！');
        process.exit(0);
    }
}

const save = () => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(config), 'utf-8');
}

const genEmpty = () => {
    config = { token: "", ops: [] };
}

const getConfig = () => config;

module.exports = { load, save, getConfig };