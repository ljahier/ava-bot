require('dotenv').config()
const { Client, Collection, WebhookClient, MessageEmbed } = require('discord.js')
// const Discord = require('discord.js')
const { readdirSync } = require('fs')
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'))
const hook = new WebhookClient(process.env.WEBHOOK_CLIENT, process.env.WEBHOOK_TOKEN)

const client = new Client()

client.commands = new Collection()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}

require('./services-status/app')(hook, MessageEmbed)
// hook.send('I am now alive!')

client.on('message', msg => {
    let command = msg.content.slice(process.env.COMMAND_PREFIX.length).trim().toLowerCase()

    if (!msg.content.startsWith(process.env.COMMAND_PREFIX) || msg.author.bot) return

    if (!client.commands.has(command)) return

    try {
        client.commands.get(command).execute(msg, command)
    } catch (error) {
        console.error(error)
        msg.reply('there was an error trying to execute that command!')
    }
})

client.login(process.env.BOT_TOKEN)