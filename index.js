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
var keywords = sqlDialect.keywords;

//User config

var dbSetting = userConfig.dbConfig;

var userWords = [];
userWords.push(userConfig.inputOutputWords.inputWords);
userWords.push(userConfig.inputOutputWords.outputWords);

var inputFilename= userConfig.environment.inputFilename;
var outputFilename = userConfig.environment.outputFilename ?
    userConfig.environment.outputFilename : "obfuscated_" + userConfig.environment.inputFilename;


//TODO: const input
function obfuscate(input) {
    var ouput = input;
    fs.writeFileSync(outputFilename,input)
}

//Maching
function matchUserAndSqlWords(userWords, sqlKeywords) {
    var mathes = [];
    userWords.forEach(function (word) {
        if(sqlKeywords.indexOf(String(word).toUpperCase())>-1){
            mathes.push(word);
        }
    });
    if(mathes.length)console.log(`Warning fields: [${mathes}] is sql keywords`);
}

matchUserAndSqlWords(userWords,keywords);

function sqlSymmetricObfuscator() {
    console.log(`Loading postgres version ${sqlDialect.version}, dictionary contains ${sqlDialect.keywords.length} words`);

    console.log('obfuscation started...');

    console.log("out file name: " + outputFilename);

    fs.readFile(path.resolve(__dirname, inputFilename), {encoding: 'utf8'}, function (err, data) {
        if (err) throw err;
        console.log("in " + inputFilename );
        obfuscate(data);
        console.log(`+ File ${inputFilename} obfuscated successfuly`);
    });

}

function sqlDeobfuscation() {
    console.log('deobfuscation started...');
    console.log("Input and output words\n" + inputOutputWords.inputWords +"\n" +  inputOutputWords.outputWords );
}

module.exports = {
    sqlSymmetricObfuscator: sqlSymmetricObfuscator,
    sqlDeobfuscation:   sqlDeobfuscation
};

/**
 * Выполняется только в случае если вызывается как файл
 */
if(require.main === module){
    sqlSymmetricObfuscator();
}
