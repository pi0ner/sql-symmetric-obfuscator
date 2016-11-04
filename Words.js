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

/**
 * Return service sql and user words not to beobfuscation
 * @return [String] words
 */
function getUnchangingWords() {
    var unchangingWords = new Array;
    unchangingWords =
        unchangingWords.concat(sqlKeywords)
            .concat(sqlDelimiters)
            .concat(userWords)
    ;
    return unchangingWords;
}

/**
 * Get random string with length setted in obfuscationConfig.wordLength
 * @return {String} random word
 */
function getRandomName() {
    return new Array(obfuscationConfig.wordLength).fill("hi").map(function (e) {
        return Math.floor(Math.random()*(36-10) +10).toString(36)
    }).join("");
}

//TODO: fix case sansitive filter
/**
 * Get random string if word not in const words, user/sql words if its,
 * for similar obfuscating words return similar random string
 * @param {String} word
 * @param {Function} newNameChanger - method return new string
 * @param {String} filter - method return [String] list words not user in changing
 * @return {String} newWord
 */
function getNewName(word, newNameChanger, filter) {
    newNameChanger = newNameChanger? newNameChanger: getRandomName;
    filter = filter? filter : getUnchangingWords;;

    // console.log(word + "|" + filter().indexOf(String(word)));//dd

    if(filter().indexOf(String(word).toUpperCase())>-1){
        return word;
    }else{
        let newWord = dictionary.get(word);
        newWord = newWord? newWord: newNameChanger(word);
        dictionary.set(word,newWord);
        return newWord;
    }
}

/**
 * Set new user word array
 * @param [String] words
 */
function setUserWords(words) {
    userWords = words.map(function (word) {
        return word.toUpperCase();
    });
}

/**
 * Get user word array
 * @return [String] userWords
 */
function getUserWords() {
    return userWords;
}

/**
 * Maches user and sql words
 * @param {function} callback
 */
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
    getUnchangingWords: getUnchangingWords,
    matchUserAndSqlWords: matchUserAndSqlWords
}