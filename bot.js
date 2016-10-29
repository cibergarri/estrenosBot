var TelegramBot = require('node-telegram-bot-api');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
 
var token = '290157752:AAHg_tY6doG9LsvsULyyMzDkqVFxiN5VIPw';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

bot.onText(/^\/estrenos/, function (msg) {
  var xhr = new XMLHttpRequest();
  var json_string=httpGet("https://api.themoviedb.org/3/movie/now_playing?api_key=44a2cd8bedba52acd348d4456277bd51&language=es-ES", false);  
  var obj = JSON.parse( json_string );
  var resul="";
  obj.results.forEach(function(item,index){
    resul +=item.title + "\n";
  });  
  var chatId = msg.chat.id;
  bot.sendMessage(chatId,resul);
});
bot.onText(/^\/cines/,function(msg){
  var chatId = msg.chat.id;
  bot.sendMessage(chatId,"cines");
});
bot.on('text',function(msg){

});

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

console.log('bot server started...');