const fs = require('fs');
const { sendText, sendImg } = require('./util.cjs');

let luckJson = {};

const ranInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const loadLuckConfig = () => {
    if (fs.existsSync('./config/luck.json'))
        luckJson = JSON.parse(fs.readFileSync('./config/luck.json', 'utf8'));
}

const saveLuckConfig = () => {
    fs.writeFileSync('./config/luck.json', JSON.stringify(luckJson));
}

const mainLuckList = [
    { text: '大吉', case: [{ good: Infinity, bad: 0 }, { good: 2, bad: 0 }] },
    { text: '中吉', case: [{ good: 2, bad: 1 }] },
    { text: '小吉', case: [{ good: 2, bad: 2 }] },
    { text: '小凶', case: [{ good: 2, bad: 2 }] },
    { text: '中凶', case: [{ good: 1, bad: 2 }] },
    { text: '大凶', case: [{ good: 0, bad: Infinity }, { good: 0, bad: 2 }] }
];
const partLuckList = [
    { text: 'AC题', good: ['道道AC', 'AKIOI'], bad: ['听取WA声一片'] },
    { text: '背课文', good: ['看一眼就记住'], bad: ['脑容量只有1kb'] },
    { text: '做作业', good: ['题题都对'], bad: ['题题都错'] },
    { text: '写代码', good: ['不用测试直接过'], bad: ['java.lang.NullPointerException', '全是bug'] }
];

const pickOnePart = (vis) => {
    if (vis.length == partLuckList.length) throw new RangeError();
    let index = ranInt(0, partLuckList.length);
    while (vis.find(x => x == index) != null) {
        index--;
        if (index < 0) index += partLuckList.length;
    }
    return index;
}

const buildPart = (part, isGood) => {
    if (isGood) return { text: part.text, subtext: part.good[ranInt(0, part.good.length)] };
    else return { text: part.text, subtext: part.bad[ranInt(0, part.bad.length)] };
}

const generate = () => {
    let mainLuck = ranInt(0, 6);
    let mainText = mainLuckList[mainLuck].text;
    let partCnt = ranInt(0, mainLuckList[mainLuck].case.length);
    let good = mainLuckList[mainLuck].case[partCnt].good;
    let bad = mainLuckList[mainLuck].case[partCnt].bad;
    if (good == Infinity) return { main: mainText, good: [{ text: '诸事皆宜', subtext: '' }], bad: [] };
    if (bad == Infinity) return { main: mainText, good: [], bad: [{ text: '诸事不宜', subtext: '' }] };
    let vis = [], goodC = [], badC = [];
    for (let i = 0; i < good; i++) {
        let index = pickOnePart(vis);
        vis.push(index);
        goodC.push(buildPart(partLuckList[index], true));
    }
    for (let i = 0; i < bad; i++) {
        let index = pickOnePart(vis);
        vis.push(index);
        badC.push(buildPart(partLuckList[index], false));
    }
    return { main: mainText, good: goodC, bad: badC };
}

const toText = (json) => {
    let text = `§${json.main}§`;
    text += '\n宜：';
    if (json.good.length == 0) text += '无';
    for (let i = 0; i < json.good.length; i++)
        text += `\n${json.good[i].text} ${json.good[i].subtext}`;
    text += '\n忌：';
    if (json.bad.length == 0) text += '无';
    for (let i = 0; i < json.bad.length; i++)
        text += `\n${json.bad[i].text} ${json.bad[i].subtext}`;
    return text;
}

const saveData = (qq, data) => {
    if (luckJson[qq]?.data == null)
        luckJson[qq] = {};
    luckJson[qq].time = new Date().getTime();
    luckJson[qq].data = data;
}

const getData = (qq) => {
    if (luckJson[qq]?.data == null) return null;
    if (datesAreOnSameDay(luckJson[qq].time, new Date().getTime()))
        return luckJson[qq].data;
    return null;
}

const datesAreOnSameDay = (f, s) => {
    const first = new Date(f), second = new Date(s);
    return first.getFullYear() == second.getFullYear() &&
        first.getMonth() == second.getMonth() &&
        first.getDate() == second.getDate();
}

const onMessage = (client, e) => {
    let message = e.content;
    if (message == '/luck') {
        try {
            let data = getData(e.author.id);
            if (data == null) {
                data = generate();
                saveData(e.author.id, data);
                saveLuckConfig();
            }
            sendText(client, e.channelId, e.author.nickname + ' 的今日运势\n' + toText(data));
        } catch (err) {
            console.log(err);
        }
    }
}

const onLoad = (config, client) => {
    loadLuckConfig();
}

const config = {
    id: 'luck',
    name: '今日运势',
    menu: '/luck 今日运势'
};

module.exports = { config, onMessage, onLoad };