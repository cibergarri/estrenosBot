var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var apiKey="44a2cd8bedba52acd348d4456277bd51";
var releasesUrl="https://api.themoviedb.org/3/movie/now_playing";

exports.getReleases= function getReleases(lang,page)
{
  var xhr = new XMLHttpRequest();
  var url=releasesUrl +"?api_key=" + apiKey + "&language=" +lang + "&page=" + page;
  var json_string=httpGet(url, false);  
  var obj = JSON.parse( json_string );
  //console.log(obj);
  var resul="Pagina " + page + " de " + obj.total_pages + "\n";
  obj.results.forEach(function(item,index){
    resul +=item.title + " (" + item.vote_average + ")\n";
  });  
  if(page>1)
    resul+="/previous para anteriores...\n\n";  
  if(page<obj.total_pages)
    resul+="/next para siguientes...";
  return resul;
}


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}