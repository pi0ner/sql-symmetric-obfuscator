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

//User config

var dbSetting = userConfig.dbConfig;

var userWords = [];
userWords.push(userConfig.inputOutputWords.inputWords);
userWords.push(userConfig.inputOutputWords.outputWords);

var inputFilename= userConfig.environment.inputFilename;
var outputFilename = userConfig.environment.outputFilename ?
    userConfig.environment.outputFilename : "obfuscated_" + userConfig.environment.inputFilename;


//TODO: const input
function obfuscate(input,callback) {
    var ouput = input;
    callback(ouput);
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
