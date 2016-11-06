var jsonfile = require('jsonfile')
 
exports.get=function(lang,word)
{
    console.log(lang);
    var code=lang.split('-')[0];

    var json=jsonfile.readFileSync("./locales/" + code + ".json");
    console.log(json);
    return json[word];

};