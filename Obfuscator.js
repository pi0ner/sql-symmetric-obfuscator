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

var sqlDialect = moduleConfig.postgres;

//Module config
var migrationConfig = moduleConfig.migration;

//User config
var dbSetting = userConfig.dbConfig;
var obfuscationConfig = userConfig.obfuscateConfig;

var inputFilename= userConfig.environment.inputFilename;
var outputFilename = userConfig.environment.outputFilename ?
    userConfig.environment.outputFilename : "obfuscated_" + userConfig.environment.inputFilename;

function showSettings () {
    console.log(`Loading postgres version ${sqlDialect.version}, dictionary contains ${sqlDialect.keywords.length} words`);

    console.log("Output file name: " + outputFilename);

    words.matchUserAndSqlWords(function (matches) {
        if(matches.length)console.log(`Warning fields: [${matches}] is sql keywords`);
    });
}

/**
 * Gets table name in query
 * @param {String} query
 * @return {String} tableName
 */
function getTableName(query) {
    var tableNames = query.match(/CREATE OR REPLACE (TABLE|VIEW) (\S*)\s*(\(|AS)/i);
    if(tableNames)
        return tableNames[2];
    else return "";
}

/**
 * Parse query to parts (words and delimiters), exec callback for every element
 * @param {String} query
 * @param {function} callback
 */
function getTokensAndDelimiters(query, callback) {
    // var output = data.split(new RegExp(sqlDelimiters.join("|")));//(/([, \n;])/);
    var output = query.split(/([, \n;\(\))])/);
    callback(output.filter(function (element) {
        return element?true:false
    }));
}

//TODO: getNewName and changeName - is duplicates
/**
 * Change field to tableName.field in query
 * @param {String} query
 * @param {function} callback
 */
function appendTableToFields(query, callback) {
    var table = getTableName(query);
    getTokensAndDelimiters(query, function (tokensAndDelimiters) {
        callback(changeNames(
            tokensAndDelimiters,
            function (word) {
                return words.getNewName(
                    word,
                    function () {
                        return table + "."+word;
                    },
                    function (word) {
                        //TODO: remove indexOf + upperCase
                        if(word.indexOf(table + ".")>-1)
                            return true
                        else
                            return words.defaultFilter(
                                word,
                                //TODO:how??? func + element = func(elems + element)
                                function () {
                                    return words.getUnchangingWords().concat(table.toUpperCase())
                                }
                            );
                    }
                );
        }));
    });
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
    appendTableToFields(query,function (normalizedArray) {
        callback(normalizedArray.join(""));
    })
}


module.exports = {
    showSettings: showSettings,
    inputFilename:inputFilename,
    outputFilename:outputFilename,
    getTokensAndDelimiters: getTokensAndDelimiters,
    getTableName:   getTableName,
    appendTableToFields: appendTableToFields,
    obfuscate: obfuscate
};
