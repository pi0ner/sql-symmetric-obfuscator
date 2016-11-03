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


/**
 * Gets table name in query
 * @param {String} query
 * @return {String} tableName
 */
function getTableName(query) {
    var tableNames = query.match(/CREATE OR REPLACE TABLE (.*)\s*\(/i);
    return tableNames[1];
}

//TODO: end comment and function
/**
 * Change field to tableName.field in query
 * @param {String} query
 * @param {function} callback
 */
function appendTableToFields(query, callback) {
    var table = getTableName(query);
    getTokensAndDelimiters(query, function (tokensAndDelimiters) {
        
    });
}

/**
 * Parse query to parts (words and delimiters), exec callback for every element
 * @param {String} query
 * @param {function} callback
 */
function getTokensAndDelimiters(query, callback) {
    // var output = data.split(new RegExp(sqlDelimiters.join("|")));//(/([, \n;])/);
    var output = query.split(/([, \n;])/);
    callback(output.filter(function (element) {
        return element?true:false
    }));
}

/**
 * Change words to callback(word)
 * @param [String] inputArray
 * @param {function} changer
 * @return [String] changedNames
 */
function changeNames(inputArray, changer) {
    var changedNames = inputArray.map(function(word){
        return changer(word)
    });
    return changedNames;
}

/**
 * Obfuscate query
 * @param {String} query
 * @param {Function} callback
 */
//TODO: const input
function obfuscate(query,callback) {
    tokensAndDelimiters(query,function (inputArray) {
        changeNames(inputArray,function (changedArray) {
            callback(changedArray.join(""));
        })
    });
}

/**
 * Main obfuscator method
 */
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

/**
 * Main deobfuscator mathod
 */
function sqlDeobfuscation() {
    console.log('deobfuscation started...');
    console.log("Input and output words\n" + inputOutputWords.inputWords +"\n" +  inputOutputWords.outputWords );
}

module.exports = {
    sqlSymmetricObfuscator: sqlSymmetricObfuscator,
    sqlDeobfuscation:   sqlDeobfuscation,

    getTokensAndDelimiters: getTokensAndDelimiters,
    getTableName:   getTableName,
    obfuscate: obfuscate
};

/**
 * Run if exec 'node thisModuleName'
 */
if(require.main === module){
    sqlSymmetricObfuscator();
}
