var TelegramBot = require('node-telegram-bot-api');

var botToken = '290157752:AAHg_tY6doG9LsvsULyyMzDkqVFxiN5VIPw';
// Setup polling way
var bot = new TelegramBot(botToken, {polling: true});

bot.onText(/^\/[0-9]/, function (msg) {
    console.log(msg);

});