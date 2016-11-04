/**
 * Created by pi0ner on 04.11.16.
 */

var expect = require("chai").expect;
var assert = require("chai").assert;
var extend = require("util")._extend;
var obfuscator = require("../Obfuscator");
//var words = require("../Words");
var setUserWords = require("../Words").setUserWords;

describe("Obfuscator tests", function() {

    before(function () {
        // it("loadConfig", function () {
        //     done();
        // })
    });

    beforeEach(function() {
        //"Вход в тест"
        var newUserwords = ['select','field1'];
        setUserWords(newUserwords);

    });

    afterEach(function() {
        //"Выход из теста"
    });


    it("getTableName",function (done) {
        try{
            var text = "CREATE OR REPLACE TABLE table1(id INT, value TEXT);";
            expect(obfuscator.getTableName(text)).to.eql("table1");
            done();
        }catch (err){
            done(err);
        }
    });

    it("getTokensAndDelimiters",function (done) {
        try{
            var data = "SELECT \n field1, field2 FROM view1; ";
            var splitedData = ["SELECT"," ","\n"," ","field1",","," ","field2"," ","FROM"," ","view1",";"," "]

            obfuscator.getTokensAndDelimiters(data,function (obfuscatedData) {
                expect(obfuscatedData).to.eql(splitedData);
                done();
            });
        } catch (err){
            done(err);
        }
    });

    it("appendTableToFields",function (done) {
        try{
            var text = "CREATE OR REPLACE TABLE table1(id1 INT, table1.value1 TEXT);";
            obfuscator.appendTableToFields(text,function (wordArray) {
                expect(wordArray.join("")).to.eql("CREATE OR REPLACE TABLE table1(table1.id1 INT, table1.value1 TEXT);");
            });
            done();
        }catch (err){
            done(err);
        }
    });

    it("obfuscate",function (done) {
        try{
            var data = "SELECT \n field1, field2 AS field1 FROM view1; ";
            var targetOutputData = "SELECT \n field1, field2 FROM view1; "
            obfuscator.obfuscate(data,function (obfuscatedData) {
                expect(obfuscatedData).to.eql(targetOutputData);
                done();
            });
        } catch (err){
            done(err);
        }
    });
});