var TelegramBot = require('node-telegram-bot-api');
var session=require("./session.js");
var api=require("./api.js");
var language=require("./language.js");

var botToken = '290157752:AAHg_tY6doG9LsvsULyyMzDkqVFxiN5VIPw';
// Setup polling way
var bot = new TelegramBot(botToken, {polling: true});

bot.onText(/^\/settings/, function (msg) {
  var chatId = msg.chat.id;
  var ses=session.getSession(chatId);
  var message= "lenguaje actual: " + language.getLanguageDescription(ses.lang);
  message+='\nset your language';
  var options=[];
  language.getLanguages().forEach(function(item,index){
    options.push(
      {
        "text":item.description,
        "callback_data": "language_" + index
      }
      );
  }); 

  var markup= JSON.stringify({
      "inline_keyboard": [options]
      });
  var opts = {reply_to_message_id: msg.message_id, reply_markup: markup};
  bot.sendMessage(chatId, message, opts);  
});
/*bot.on('chosen_inline_result',function (msg) {
  console.log(msg);
});*/
bot.on('callback_query',function (callbackQuery) {
  //console.log("callback Query");
  //console.log(callbackQuery);
  var chatId = callbackQuery.message.chat.id;
  var ses=session.getSession(chatId);  
  ses.lang=Number(callbackQuery.data.split('_')[1]);

  var options = {
     chat_id: callbackQuery.message.chat.id,
     message_id: callbackQuery.message.message_id
   };
   var message= "lenguaje actual: " + language.getLanguageDescription(ses.lang);
   bot.editMessageText(message, options);
});
 
bot.onText(/^\/start/, function (msg) {
  var chatId = msg.chat.id;
  var ses=session.getSession(chatId);
  ses.releasesPage=1;
  var resul= api.getReleases(ses.lang,ses.releasesPage);
  bot.sendMessage(chatId,resul);
}); 

bot.onText(/^\/next/,function(msg){
  var chatId = msg.chat.id;
  var ses=session.getSession(chatId);
  ses.releasesPage+=1;
  var resul= api.getReleases(ses.lang,ses.releasesPage);
  bot.sendMessage(chatId,resul);
});

bot.onText(/^\/previous/,function(msg){
  var chatId = msg.chat.id;
  var ses=session.getSession(chatId);
  if(ses.releasesPage>1)
    ses.releasesPage-=1;
  var resul= api.getReleases(ses.lang,ses.releasesPage);
  bot.sendMessage(chatId,resul);
});

bot.onText(/^\/cines/,function(msg){
  var chatId = msg.chat.id;
  bot.sendMessage(chatId,"cines");
});

bot.on('text',function(msg){

});

console.log('bot server started...');