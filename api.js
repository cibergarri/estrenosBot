var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var translate=require("./translate.js");
var format = require('string-format')

var apiKey="44a2cd8bedba52acd348d4456277bd51";
var version3="3";

var imageWidth="w300";

var urls={
    "base":"https://api.themoviedb.org",
    "releases":"movie/now_playing",
    "movie":"movie/{0}",
    "config":"configuration",
    "search":"search/movie",
    "similar":"movie/{0}/similar"
};

exports.getReleases= function getReleases(langCode,page)
{
    var xhr = new XMLHttpRequest();
    var url=getUrl(version3,urls.releases,langCode,page);
    var json_string=httpGet(url, false);  
    var obj = JSON.parse( json_string );
    return obj;
}

exports.getMovieInfo=function getMovieInfo(langCode,id)
{
    var xhr = new XMLHttpRequest();
    //getMovieInfo
    var url=getUrl(version3,urls.movie,langCode,undefined,id);
    var json_string=httpGet(url, false);  
    var movieInfo = JSON.parse( json_string );
    var image;
    if(movieInfo.backdrop_path!=null)
    {
        //getConfigInfo
      url=getUrl(version3,urls.config,langCode);
      json_string=httpGet(url, false);
      var configInfo = JSON.parse( json_string );
      image =configInfo.images.base_url + imageWidth + movieInfo.backdrop_path;
    }
    
    return {
      "movieInfo":movieInfo,
      "image":image
    }
}

exports.getSimilarMovies=function getMovieInfo(langCode,id,page)
{
     var xhr = new XMLHttpRequest();
    //getMovieInfo
    var url=getUrl(version3,urls.similar,langCode,page,id);
    var json_string=httpGet(url, false);
    var movieSearch = JSON.parse( json_string );
    return movieSearch;
}

exports.getMovieSearch= function(langCode,query,page)
{
    var xhr = new XMLHttpRequest();
    var url=getUrl(version3,urls.search,langCode,page);
    url+="&query=" + query;
    var json_string=httpGet(url, false);  
    var movieSearch = JSON.parse( json_string );
    return movieSearch;
}

function getUrl(version,suffix,langCode,page,id)
{
    url= urls.base + "/" + version + "/" +suffix;
    if(id!=undefined) url=format(url,id);
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


