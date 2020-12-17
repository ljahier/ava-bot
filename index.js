const Discord = require('discord.js')
const commands = require('./commands.json')

const client = new Discord.Client()

require('dotenv').config()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
    for (let [cmd, path] of Object.entries(commands)) {
        if (`!${cmd}` === msg.content) {
            if (path.path === "") {
                msg.channel.send("This command is not implemeted yet !")
            } else {
                require(path.path)(msg)
            }
        }
    }
})

client.login(process.env.BOT_TOKEN)