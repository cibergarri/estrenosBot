var TelegramBot = require('node-telegram-bot-api');
var session=require("./session.js");
var api=require("./api.js");
var language=require("./language.js");
var translate=require("./translate.js");
var format = require('string-format')

var botToken = '290157752:AAHg_tY6doG9LsvsULyyMzDkqVFxiN5VIPw';
// Setup polling way
var bot = new TelegramBot(botToken, {polling: true});

bot.onText(/^\/settings/, function (msg) {
  var chatId = msg.chat.id;
  var ses=session.getSession(chatId);
  var langCode=language.getLanguageCode(ses.lang);
  var message= translate.get(langCode ,'currentLanguage') + language.getLanguageDescription(ses.lang);
  message+='\n' + translate.get(langCode ,'setLanguage');
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
  var callbackData=callbackQuery.data.split('_');
  var options = {
        chat_id: callbackQuery.message.chat.id,
        message_id: callbackQuery.message.message_id
      };
  var message;
  var langCode=language.getLanguageCode(ses.lang);
  switch(callbackData[0])
  {
    case "language":
      ses.lang=Number(callbackData[1]);
      langCode=language.getLanguageCode(ses.lang);
      message= translate.get(langCode ,'currentLanguage') + language.getLanguageDescription(ses.lang);
      bot.editMessageText(message, options);
    break;
    case "movies":
      switch(callbackData[1])
      {
        case "previous":
          if(ses.releasesPage>1) ses.releasesPage-=1;
        break;
        case "next":
          ses.releasesPage+=1;
        break;
      }
      var resul= api.getReleases(language.getLanguageCode(ses.lang),ses.releasesPage);
      //bot.sendMessage(chatId,);
      var pag=getPagination(resul,langCode);
      bot.sendMessage(chatId,getMovies(resul) + pag.message,pag.opts);
    break;
  }  
});
 
bot.onText(/^\/start/, function (msg) {
  var chatId = msg.chat.id;
  var ses=session.getSession(chatId);
  ses.releasesPage=1;
  var langCode=language.getLanguageCode(ses.lang);
  var resul= api.getReleases(langCode,ses.releasesPage);
  //bot.sendMessage(chatId,getMovies(resul));
  var pag=getPagination(resul,langCode);
  bot.sendMessage(chatId,getMovies(resul) + pag.message,pag.opts);
}); 

/*bot.onText(/^\/next/,function(msg){
  var chatId = msg.chat.id;
  var ses=session.getSession(chatId);
  ses.releasesPage+=1;
  var resul= api.getReleases(language.getLanguageCode(ses.lang),ses.releasesPage);
  bot.sendMessage(chatId,resul);
});

bot.onText(/^\/previous/,function(msg){
  var chatId = msg.chat.id;
  var ses=session.getSession(chatId);
  if(ses.releasesPage>1)
    ses.releasesPage-=1;
  var resul= api.getReleases(language.getLanguageCode(ses.lang),ses.releasesPage);
  bot.sendMessage(chatId,resul);
});*/

/*bot.onText(/^\/cines/,function(msg){
  var chatId = msg.chat.id;
  bot.sendMessage(chatId,"cines");
});*/

bot.onText(/^\/movie(.+)/, function (msg,match) {
   var chatId = msg.chat.id;
   var movieId = match[1];
   var ses=session.getSession(chatId);
   var resul= api.getMovieInfo(language.getLanguageCode(ses.lang),movieId);
   bot.sendMessage(chatId,resul);
});

bot.on('text',function(msg){

});


function getMovies(obj){
  var movies="";//format(translate.get(lang,'pageOf'),page,obj.total_pages) + "\n";
  obj.results.forEach(function(item,index){
    movies +=item.title + " (" + item.vote_average + ") '/movie" + item.id + "'\n";
  });
  return movies;
}

function getPagination(obj,lang)
{
  var message=format(translate.get(lang,'pageOf'),obj.page,obj.total_pages) + "\n";
  var opts;
  if(obj.total_pages>1)
  {
    var options=[];
    if(obj.page>1)
    {
      options.push(
      {
        "text":translate.get(lang,'forPrevious'),
        "callback_data": "movies_previous"
      });
    }
    if(obj.page<obj.total_pages)
    {
      options.push(
      {
        "text":translate.get(lang,'forNext'),
        "callback_data": "movies_next"
      });
    }
    var markup= JSON.stringify({
      "inline_keyboard": [options]
      });
    opts = {/*reply_to_message_id: msg.message_id,*/ reply_markup: markup};
  }
  return {
    "message":message,
    "opts":opts
  };

}


console.log('bot server started...');