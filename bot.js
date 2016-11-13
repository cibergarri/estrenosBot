var TelegramBot = require('node-telegram-bot-api');
var session=require("./session.js");
var api=require("./api.js");
var language=require("./language.js");
var translate=require("./translate.js");
var format = require('string-format')

var botToken = '290157752:AAHg_tY6doG9LsvsULyyMzDkqVFxiN5VIPw';
// Setup polling way
var bot = new TelegramBot(botToken, {polling: true});

var regExp={
  "start":/^\/start/,
  "settings":/^\/settings/,
  "title":/^\/title (.+)/,
  "movie":/^\/movie(.+)/,
  "similar":/^\/similar(.+)/,
  "help":/^\/help/
}

var callback_ids={
  "language":"language",
  "movies":"movies",
  "search":"search",
  "similar":"similar",
  "previous":"previous",
  "next":"next"
}

bot.onText(regExp.settings, function (msg) {
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
        "callback_data": callback_ids.language + "_" + index
      }
      );
  }); 

  var markup= JSON.stringify({
      "inline_keyboard": [options]
      });
  var opts = {reply_to_message_id: msg.message_id, reply_markup: markup};
  bot.sendMessage(chatId, message, opts);  
});
 
bot.onText(regExp.start, function (msg) {
  var chatId = msg.chat.id;
  var ses = session.getSession(chatId);
  ses.releasesPage=1;
  var langCode = language.getLanguageCode(ses.lang);
  var resul = api.getReleases(langCode,ses.releasesPage);
  var pag = getPagination(resul,langCode,callback_ids.movies);
  bot.sendMessage(chatId,getMovies(resul) + pag.message,pag.opts);
}); 


bot.onText(regExp.title, function (msg,match) {
   var chatId = msg.chat.id;
   var query="";
   i=1;
   while(match[i]!=undefined)
   {  
      if(query!="") query+="+";
      query+=match[i]
      i+=1;
   }
   var ses=session.getSession(chatId);
   ses.searchPage=1;
   var langCode=language.getLanguageCode(ses.lang);
   var resul= api.getMovieSearch(langCode,query,ses.searchPage);
   var response="";
   resul.results.forEach(function(item,index){
     response+=item.title + " /movie" + item.id + "\n";
   });
   var pag=getPagination(resul,langCode, callback_ids.search + "_" + query);
   bot.sendMessage(chatId,response + pag.message,pag.opts);
});

bot.onText(regExp.movie, function (msg,match) {
   var chatId = msg.chat.id;
   var movieId = match[1];
   var ses=session.getSession(chatId);
   var resul= api.getMovieInfo(language.getLanguageCode(ses.lang),movieId);
   
   var info="";
   if(resul.image!=undefined)info +=resul.image;
   var lang=language.getLanguageCode(ses.lang);
   info+="\n"+ translate.get(lang,'title') + ": " + resul.movieInfo.title;
   info+="\n"+ translate.get(lang,'tagline') + ": " + resul.movieInfo.tagline;
   info+="\n"+ translate.get(lang,'originalTitle') + ": " + resul.movieInfo.original_title;
   info+="\n"+ translate.get(lang,'genres') + ": ";
   if(resul.movieInfo.genres!=undefined)
   {
      resul.movieInfo.genres.forEach(function(item,index){
        info+=item.name + " ";
      });
   }     
   info+="\n"+ translate.get(lang,'overview') + ": " + resul.movieInfo.overview;
   info+="\n"+ translate.get(lang,'companies') + ": ";
   resul.movieInfo.production_companies.forEach(function(item,index){
      info+=item.name + " ";
   });
   info+="\n"+ translate.get(lang,'releaseDate') + ": " + resul.movieInfo.release_date;
   info+="\n"+ translate.get(lang,'similarMovies') + ": /similar" + movieId;
   bot.sendMessage(chatId,info);
});

bot.onText(regExp.similar, function (msg,match) {
   var chatId = msg.chat.id;
   var movieId = match[1];
   var ses=session.getSession(chatId);
   ses.similarPage=1;
   var langCode=language.getLanguageCode(ses.lang);
   var resul= api.getSimilarMovies(langCode,movieId,ses.similarPage);
   var response="";
   resul.results.forEach(function(item,index){
     response+=item.title + " /movie" + item.id + "\n";
   });
   var pag=getPagination(resul,langCode, callback_ids.similar + "_" + movieId);
   bot.sendMessage(chatId,response + pag.message,pag.opts);
});

/*bot.on('text',function(msg){

});*/

bot.onText(regExp.help, function (msg) {
  var chatId = msg.chat.id;
  var ses=session.getSession(chatId);
  var lang=language.getLanguageCode(ses.lang);
  var helpInfo="";
  for(i=1;i<=5;i++)
  {
    helpInfo+=translate.get(lang,'helpInfo'+i) + "\n";
  }
  bot.sendMessage(chatId,helpInfo);
});


bot.on('callback_query',function (callbackQuery) {
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
    case callback_ids.language: //"language":
      ses.lang=Number(callbackData[1]);
      langCode=language.getLanguageCode(ses.lang);
      message= translate.get(langCode ,'currentLanguage') + language.getLanguageDescription(ses.lang);
      bot.editMessageText(message, options);
    break;
    case callback_ids.movies: //"movies":
      switch(callbackData[1])
      {
        case callback_ids.previous://"previous":
          if(ses.releasesPage>1) ses.releasesPage-=1;
        break;
        case callback_ids.next: //"next":
          ses.releasesPage+=1;
        break;
      }
      var resul= api.getReleases(language.getLanguageCode(ses.lang),ses.releasesPage);
      var pag=getPagination(resul,langCode,callback_ids.movies);
      bot.sendMessage(chatId,getMovies(resul) + pag.message,pag.opts);
    break;
    case callback_ids.search: //"search":
      switch(callbackData[2])
      {
        case callback_ids.previous: //"previous":
          if(ses.searchPage>1) ses.searchPage-=1;
        break;
        case callback_ids.next://"next":
          ses.searchPage+=1;
        break;
      }
      var query=callbackData[1];
      var resul= api.getMovieSearch(language.getLanguageCode(ses.lang),query,ses.searchPage);
      var pag=getPagination(resul,langCode,callback_ids.search + "_" + query);
      bot.sendMessage(chatId,getMovies(resul) + pag.message,pag.opts);
    break;
    case callback_ids.similar: //"similar movies":
      switch(callbackData[2])
      {
        case callback_ids.previous://"previous":
          if(ses.similarPage>1) ses.similarPage-=1;
        break;
        case callback_ids.next: //"next":
          ses.similarPage+=1;
        break;
      }
      var movieId=callbackData[1];
      var resul= api.getSimilarMovies(language.getLanguageCode(ses.lang),movieId,ses.similarPage);
      var pag=getPagination(resul,langCode,callback_ids.similar + "_" + movieId);
      bot.sendMessage(chatId,getMovies(resul) + pag.message,pag.opts);
    break;
  }  
});




function getMovies(obj)
{
  var movies="";//format(translate.get(lang,'pageOf'),page,obj.total_pages) + "\n";
  obj.results.forEach(function(item,index){
    movies +=item.title + " (" + item.vote_average + ") /movie" + item.id + "\n";
  });
  return movies;
}

function getPagination(obj,lang,callback_code)
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
        "callback_data": callback_code + "_" + callback_ids.previous
      });
    }
    if(obj.page<obj.total_pages)
    {
      options.push(
      {
        "text":translate.get(lang,'forNext'),
        "callback_data": callback_code + "_" + callback_ids.next
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