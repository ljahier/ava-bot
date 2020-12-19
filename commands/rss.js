// const axios = require('axios')
// const { MessageEmbed } = require('discord.js')
// const xml2js = require('xml2js')

module.exports = {
    name: 'rss',
    description: 'Get the lasts news from rss feed sources',
    execute(message) {
        message.channel.send('Rss');
    },
};