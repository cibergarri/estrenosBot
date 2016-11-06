var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var apiKey="44a2cd8bedba52acd348d4456277bd51";
var releasesUrl="https://api.themoviedb.org/3/movie/now_playing";
var translate=require("./translate.js");
var format = require('string-format')

exports.getReleases= function getReleases(lang,page)
{
  var xhr = new XMLHttpRequest();
  var url=releasesUrl +"?api_key=" + apiKey + "&language=" +lang + "&page=" + page;
  var json_string=httpGet(url, false);  
  var obj = JSON.parse( json_string );
  //console.log(obj);
  var resul=format(translate.get(lang,'pageOf'),page,obj.total_pages) + "\n";
  obj.results.forEach(function(item,index){
    resul +=item.title + " (" + item.vote_average + ")\n";
  });  
  if(page>1)
    resul+="/previous " + translate.get(lang,'forPrevious') + "\n\n";  
  if(page<obj.total_pages)
    resul+="/next " +  translate.get(lang,'forNext');
  return resul;
}


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}