var stats = require('./stats.js');
var sessionsInfo={};

exports.getSession= function getSession(chatId)
{   
    var index=chatId.toString();
    var user_object={id:index};
    stats.write("USERS",user_object)
    if(sessionsInfo[index]==undefined)
    {
        sessionsInfo[index]=
        {
            lang:0,
            releasesPage:1,
            searchPage:1,
            similarPage:1
        }
    }
    return sessionsInfo[index];
}