/*

 */

"use strict";

var fs = require("fs");
var path = require("path");
var extend = require("util")._extend;

var words = require("./Words");

//config jsons
var moduleConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'obfuscatorConfig.json'), 'utf8'));
var userConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'userConfig.json'), 'utf8'));

//Module config
var migrationConfig = moduleConfig.migration;

//User config
var dbSetting = userConfig.dbConfig;
var obfuscationConfig = userConfig.obfuscateConfig;

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

function changeNames(inputArray, callback) {
    var outputArray = inputArray.map(function(word){
        return words.getNewName(word)
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
    obfuscate: obfuscate
};

/**
 * Выполняется только в случае если вызывается как файл
 */
if(require.main === module){
    sqlSymmetricObfuscator();
}
