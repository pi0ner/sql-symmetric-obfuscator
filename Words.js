/**
 * Created by pi0ner on 02.11.16.
 */

var fs = require("fs");
var path = require("path");
var HashMap = require("hashmap");

//config jsons
var moduleConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'obfuscatorConfig.json'), 'utf8'));
var userConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'userConfig.json'), 'utf8'));
var obfuscationConfig = userConfig.obfuscateConfig;

var sqlDialect = moduleConfig.postgres;
var sqlKeywords = sqlDialect.keywords
    .map(function (word) {
        return word.toUpperCase()
    });
var sqlDelimiters = sqlDialect.delimiters;

var dictionary = new HashMap();

var userWords = new Array;
userWords.concat(userConfig.inputOutputWords.inputWords)
    .concat(userConfig.inputOutputWords.outputWords)
    .map(function (word) {
        return word.toUpperCase()
    });

function getUnchangingWords() {
    var unchangingWords = new Array;
    unchangingWords =
        unchangingWords.concat(sqlKeywords)
            .concat(sqlDelimiters)
            .concat(userWords)
    ;
    return unchangingWords;
}

function getNewName(word) {
    if(getUnchangingWords().indexOf(String(word).toUpperCase())>-1){
        return word;
    }else{
        let newWord = dictionary.get(word);
        newWord = newWord? newWord: getRandomName();
        dictionary.set(word,newWord);
        return newWord;
    }
}

function getRandomName() {
    return new Array(obfuscationConfig.wordLength).fill("hi").map(function (e) {
        return Math.floor(Math.random()*(36-10) +10).toString(36)
    }).join("");
}


function setUserWords(words) {
    userWords = words.map(function (word) {
        return word.toUpperCase();
    });
}

function getUserWords() {
    return userWords;
}

//Maching
function matchUserAndSqlWords(callback) {
    var matches = [];
    userWords.forEach(function (word) {
        if(sqlKeywords.indexOf(String(word).toUpperCase())>-1){
            matches.push(word);
        }
    });
    callback(matches);
}

module.exports = {
    setUserWords: setUserWords,
    getUserWords: getUserWords,
    getNewName: getNewName,
    getRandomName: getRandomName,
    matchUserAndSqlWords: matchUserAndSqlWords
}