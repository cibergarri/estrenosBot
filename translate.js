var jsonfile = require('jsonfile')
 
exports.get=function(lang,word)
{
    var code=lang.split('-')[0];
    var json=jsonfile.readFileSync("./locales/" + code + ".json");
    return json[word];
};