module.exports = {
    name: 'ping',
    description: 'Basic ping command which allow user to check if bot is up',
    execute(message) {
        message.channel.send('Pong')
    },
}