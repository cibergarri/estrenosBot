var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var writeApiKey=process.env.KEEN_WRITE_KEY;
var url="https://api.keen.io/3.0/projects/583a20c68db53dfda8a796f7/events/";


exports.write= function(event,data)
{
    try
    {
        url+=event+"?api_key="+writeApiKey;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "POST", url, false );
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.send( JSON.stringify(data) );
        xmlHttp.responseText;
    } catch(err){
      console.log(err.message);
      return null;
    } 
    
}

