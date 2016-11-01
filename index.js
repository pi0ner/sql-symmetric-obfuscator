/*

 */

var pg = require("pg");
var fs = require("fs");

var path = require("path");

//config jsons
var moduleConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'obfuscatorConfig.json'), 'utf8'));
var userConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'userConfig.json'), 'utf8'));

//Module config
var migrationConfig = moduleConfig.migration;
var sqlDialect = moduleConfig.postgres;
var sqlKeywords = sqlDialect.keywords;
var sqlDelimiters = sqlDialect.delimiters;

//User config
var dbSetting = userConfig.dbConfig;
var obfuscationConfig = userConfig.obfuscateConfig;

var userWords = [];
userWords.push(userConfig.inputOutputWords.inputWords);
userWords.push(userConfig.inputOutputWords.outputWords);

var unchangingWords = new Array;
unchangingWords = unchangingWords.concat(sqlKeywords)
    .concat(sqlDelimiters)
    .concat(userConfig.inputOutputWords.inputWords)
    .concat(userConfig.inputOutputWords.outputWords)
;


var inputFilename= userConfig.environment.inputFilename;
var outputFilename = userConfig.environment.outputFilename ?
    userConfig.environment.outputFilename : "obfuscated_" + userConfig.environment.inputFilename;

function tokensAndDelimiters(data, callback) {
    // var output = data.split(new RegExp(sqlDelimiters.join("|")));//(/([, \n;])/);
    var output = data.split(/([, \n;])/);
    callback(output.filter(function (element) {
        return element?true:false
    }));
}

function getRandomName() {
    return new Array(obfuscationConfig.wordLength).fill("hi").map(function (e) {
        return Math.floor(Math.random()*(36-10) +10).toString(36)
    }).join("");
}

function changeNames(inputArray, callback) {
    console.log(unchangingWords.indexOf('COLUMN'))
    var outputArray = inputArray.map(function(word){
        if(unchangingWords.indexOf(String(word).toUpperCase())>-1){
            // console.log(String(word).toUpperCase())
            return word;
        }else{
            // console.log(String(word).toUpperCase())
            return getRandomName();
        }
    })
    callback(outputArray);
}

//TODO: const input
function obfuscate(input,callback) {
    tokensAndDelimiters(input,function (inputArray) {
        changeNames(inputArray,function (changedArray) {
            callback(changedArray.join(""));
        })
    });
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

function setUserWords(words) {
    userWords = words;
}

function sqlSymmetricObfuscator() {
    console.log(`Loading postgres version ${sqlDialect.version}, dictionary contains ${sqlDialect.keywords.length} words`);

    matchUserAndSqlWords(function (matches) {
        if(matches.length)console.log(`Warning fields: [${matches}] is sql keywords`);
    });

    console.log('obfuscation started...');

    console.log("out file name: " + outputFilename);

    fs.readFile(path.resolve(__dirname, inputFilename), {encoding: 'utf8'}, function (err, data) {
        if (err) throw err;
        console.log("in " + inputFilename );
        obfuscate(data,function (obfuscatedData) {

            console.log(obfuscatedData);
            fs.writeFileSync(outputFilename,obfuscatedData);
        });
        console.log(`+ File ${inputFilename} obfuscated successfuly`);
    });

}

function sqlDeobfuscation() {
    console.log('deobfuscation started...');
    console.log("Input and output words\n" + inputOutputWords.inputWords +"\n" +  inputOutputWords.outputWords );
}

module.exports = {
    sqlSymmetricObfuscator: sqlSymmetricObfuscator,
    sqlDeobfuscation:   sqlDeobfuscation,

    tokensAndDelimiters: tokensAndDelimiters,
    obfuscate: obfuscate,
    setUserWords: setUserWords,
    matchUserAndSqlWords: matchUserAndSqlWords
};

/**
 * Выполняется только в случае если вызывается как файл
 */
if(require.main === module){
    sqlSymmetricObfuscator();
}
