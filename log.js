var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var writeApiKey="EC15D188C926DC2D6EB94960B224076C3DD7F164BA188416E43F77A55706FFB44D764D397C3155D3A6F2380A4C359BC210FB3F5A7DF5B8C9658A80F90FAC1C99252262B0A7C2C4C931AB10816672A215CF0BB730C9C74253FDA3137F7CD597F4";
//var writeApiKey=process.env.KEEN_WRITE_KEY;
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
        console.log(xmlHttp.responseText);
    } catch(err){
      console.log(err.message);
      return null;
    } 
    
}

