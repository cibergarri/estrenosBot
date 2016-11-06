var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var apiKey="44a2cd8bedba52acd348d4456277bd51";
var baseUrl="https://api.themoviedb.org";
var version3="3";
var releasesUrl="movie/now_playing";
var movieUrl= "movie/";//284052?api_key=44a2cd8bedba52acd348d4456277bd51&language=en-US""
var configUrl="configuration";//?api_key=44a2cd8bedba52acd348d4456277bd51"
var searchUrl="search/movie";//?api_key=44a2cd8bedba52acd348d4456277bd51&query=Jack"
var translate=require("./translate.js");

exports.getReleases= function getReleases(langCode,page)
{
  var xhr = new XMLHttpRequest();
  var url=getUrl(version3,releasesUrl,langCode,page);
  var json_string=httpGet(url, false);  
  var obj = JSON.parse( json_string );
  return obj;
}
exports.getMovieInfo=function getMovieInfo(langCode,id)
{
  var xhr = new XMLHttpRequest();
  //getMovieInfo
  var url=getUrl(version3,movieUrl,langCode,undefined,id);
  var json_string=httpGet(url, false);  
  var movieInfo = JSON.parse( json_string );
  var image;
  if(movieInfo.backdrop_path!=null)
  {
      //getConfigInfo
    url=getUrl(version3,configUrl,langCode);
    json_string=httpGet(url, false);
    var configInfo = JSON.parse( json_string );
    image =configInfo.images.base_url + "w300"+ movieInfo.backdrop_path;
  }
  
  return {
    "movieInfo":movieInfo,
    "image":image
  }
}
exports.getMovieSearch= function(langCode,query,page)
{
  var xhr = new XMLHttpRequest();
  //getMovieResults
  var url=getUrl(version3,searchUrl,langCode,page);
  url+="&query=" + query;
    console.log(url);
  var json_string=httpGet(url, false);  
  var movieSearch = JSON.parse( json_string );
  console.log(movieSearch);
  return movieSearch;
}

function getUrl(version,suffix,langCode,page,id)
{
  url= baseUrl + "/" + version + "/" +suffix;
  if(id!=undefined) url+=id;
  url+="?api_key=" +apiKey;
  if(langCode!=undefined) url+="&language=" +langCode;
  if(page!=undefined) url+="&page=" + page;
  return url;
}

function httpGet(theUrl)
{
    try
    {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
      xmlHttp.send( null );
      return xmlHttp.responseText;
    } catch(err){
      console.log(err.message);
      return null;
    } 
    
}


