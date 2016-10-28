/*

 */

var pg = require("pg");
var fs = require("fs");

var path = require("path");

//TODO: refactoring(много слов)
var migrationConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'obfuscatorConfig.json'), 'utf8')).migration;

var sqlDialect = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'obfuscatorConfig.json'), 'utf8')).postgres;

var inputOutputWords = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'), 'utf8')).inputOutputWords;

var dbSetting = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'), 'utf8')).dbConfig;

function sqlSymmetricObfuscator() {
    console.log(`Loading postgres version ${sqlDialect.version}, dictionary contains ${sqlDialect.keywords.length} words`);
    console.log("Input and output words" + inputOutputWords.inputWords + inputOutputWords.outputWords );
    console.log('obfuscation started...');
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
    // insertOsTypesToDb();
}
