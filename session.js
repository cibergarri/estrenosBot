var sessionsInfo={};

exports.getSession= function getSession(chatId)
{
    var index=chatId.toString();
    if(sessionsInfo[index]==undefined)
    {
        sessionsInfo[index]=
        {
            lang:0,
            releasesPage:1
        }
    }
    return sessionsInfo[index];
}