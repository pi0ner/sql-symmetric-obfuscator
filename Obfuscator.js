/**
 * Created by pi0ner on 04.11.16.
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
        callback(changeNames(tokensAndDelimiters,function (word) {
            return table + "." + word;
        }));
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


module.exports = {
    getTokensAndDelimiters: getTokensAndDelimiters,
    getTableName:   getTableName,
    appendTableToFields: appendTableToFields,
    obfuscate: obfuscate
};
