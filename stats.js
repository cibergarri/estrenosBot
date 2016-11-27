var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var projectID=process.env.KEEN_PROJECT_ID
var writeApiKey=process.env.KEEN_WRITE_KEY;
var url="https://api.keen.io/3.0/projects/"+ projectID + "/events/";

exports.write= function(event,data)
{
    try
    {
        var theUrl= url + event + "?api_key="+writeApiKey;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "POST", theUrl, false );
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.send( JSON.stringify(data) );
        xmlHttp.responseText;
    } catch(err){
      console.log(err.message);
      return null;
    }    
}

