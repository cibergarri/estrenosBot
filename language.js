var languages=[
    {
        code:"es-ES",
        description:"Español"
    },
    {
        code:"en-US",
        description:"English(USA)"
    }
];

exports.getLanguageCode= function getLanguageCode(index)
{
    return languages[index].code;
}

exports.getLanguageDescription= function getLanguageDescription(index)
{
    return languages[index].description;
}

exports.getLanguages= function getLanguages()
{
    return languages;
}