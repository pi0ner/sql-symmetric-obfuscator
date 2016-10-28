/*

 */

var pg = require("pg");
var fs = require("fs");

var path = require("path");

//TODO: refactoring(много слов)
var moduleConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'obfuscatorConfig.json'), 'utf8'));
var userConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'userConfig.json'), 'utf8'));

//Module config
var migrationConfig = moduleConfig.migration;
//User config
var inputOutputWords = userConfig.inputOutputWords
var sqlDialect = moduleConfig.postgres;
var inputFilename= userConfig.environment.inputFilename;
var outputFilename = userConfig.environment.outputFilename ?
    userConfig.environment.outputFilename : "obfuscated_" + userConfig.environment.inputFilename;

var dbSetting = userConfig.dbConfig;
function sqlSymmetricObfuscator() {
    console.log(`Loading postgres version ${sqlDialect.version}, dictionary contains ${sqlDialect.keywords.length} words`);
    console.log("Input and output words" + inputOutputWords.inputWords + inputOutputWords.outputWords );
    console.log('obfuscation started...');
    console.log("in " + inputFilename);
    console.log("out " + outputFilename);

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
