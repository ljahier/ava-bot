const cron = require("node-cron");
const sourcesFile = require("./sources.json");
const Parser = require("rss-parser");
const fs = require("fs");

require("dotenv").config();

let parser = new Parser();
let yearMonth = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
let actualDate = `${new Date().getFullYear()}-${yearMonth[new Date().getMonth()]
    }-${new Date().getDate()}`;
let lastDate = "";

module.exports = (hook, MessageEmbed) => {
    cron.schedule('*/20 * * * *', async () => {
        console.log("running a task every 20 minutes");
        let leaveLoop = false;
        let turn = false;
        let tmp = []

        for (let i = 0; i < sourcesFile.length; i++) {
            if (leaveLoop) return
            let feed = await parser.parseURL(sourcesFile[i].url);
            for (let j = 0; j < feed.items.length && !leaveLoop; j++) {
                let itemDate = `${feed.items[j].pubDate.split(/ |:/)[3]}-${feed.items[j].pubDate.split(/ |:/)[2]
                    }-${feed.items[j].pubDate.split(/ |:/)[1]}`
                if (lastDate === itemDate && !turn) {
                    leaveLoop = true
                    return
                }
                if (itemDate === actualDate) {
                    if (!turn) {
                        lastDate = actualDate;
                        turn = true;
                    }
                    tmp.push({
                        "title": feed.items[j].title,
                        "url": feed.items[j].link,
                        "description": feed.items[j].contentSnippet.substring(0, 1999).replace(/\n/g, ""),
                        "date": feed.items[j].pubDate,
                        "author": sourcesFile[i].name
                    })
                }
            }
        }
        if (tmp.length > 0) {
            tmp.reverse()
            tmp.forEach((elem) => {
                hook.send(
                    new MessageEmbed()
                        .setAuthor(elem.author)
                        .setTitle(elem.title)
                        .setURL(elem.url)
                        .setDescription(elem.description)
                        .setFooter(elem.date))
            })
        }
    })
};
