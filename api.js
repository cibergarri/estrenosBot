var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var apiKey="44a2cd8bedba52acd348d4456277bd51";
var releasesUrl="https://api.themoviedb.org/3/movie/now_playing";
var movieUrl="https://api.themoviedb.org/3/movie/";//284052?api_key=44a2cd8bedba52acd348d4456277bd51&language=en-US""
var configUrl="https://api.themoviedb.org/3/configuration?api_key=";//44a2cd8bedba52acd348d4456277bd51"
var translate=require("./translate.js");

exports.getReleases= function getReleases(lang,page)
{
  var xhr = new XMLHttpRequest();
  var url=releasesUrl +"?api_key=" + apiKey + "&language=" +lang + "&page=" + page;
  var json_string=httpGet(url, false);  
  var obj = JSON.parse( json_string );
  //console.log(obj);
  return obj;
  /*
  var resul=format(translate.get(lang,'pageOf'),page,obj.total_pages) + "\n";
  obj.results.forEach(function(item,index){
    resul +=item.title + " (" + item.vote_average + ") '/movie" + item.id + "'\n";
  });  
  if(page>1)
    resul+="/previous " + translate.get(lang,'forPrevious') + "\n\n";  
  if(page<obj.total_pages)
    resul+="/next " +  translate.get(lang,'forNext');
  return resul;
  */
}
exports.getMovieInfo=function getMovieInfo(lang,id)
{
  var xhr = new XMLHttpRequest();
  var url=movieUrl + id +"?api_key=" + apiKey + "&language=" +lang;
  var json_string=httpGet(url, false);  
  var movieInfo = JSON.parse( json_string );
  var info="";
  info+="\nTítulo: " + movieInfo.title;
  info+="\nSubtítulo: " + movieInfo.tagline;
  info+="\nTítulo original: " + movieInfo.original_title;
  info+="\ngenero(s): ";
  movieInfo.genres.forEach(function(item,index){
      info+=item.name + " ";
  });  
  info+="\nResumen: " + movieInfo.overview;
  info+="\nProductora/s: ";
  movieInfo.production_companies.forEach(function(item,index){
      info+=item.name + " ";
  });
  info+="\nFecha de estreno: " + movieInfo.release_date;

  url=configUrl + apiKey;
  json_string=httpGet(url, false);
  var configInfo = JSON.parse( json_string );
  
  var ret=configInfo.images.base_url + "w300"+ movieInfo.backdrop_path + "\n" + "info:\n"+ info;
  return ret;
}


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}