const axios = require('axios')
const { MessageEmbed } = require('discord.js')
const xml2js = require('xml2js')

module.exports = (msg) => {
    axios.get("https://www.numerama.com/feed/")
        .then((res) => {
            // msg.channel.send(res.data)
            xml2js.parseString(res.data, (err, data) => {
                if (err) throw err
                const embed = new MessageEmbed()
                data.rss.channel[0].item.forEach(element => {
                    embed
                         .setTitle(element.title)
                         .setURL(element.link[0])
                         .setDescription(element.description)
                    msg.channel.send(embed);
                });
            })
        })
}