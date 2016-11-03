var expect = require("chai").expect;
var assert = require("chai").assert;
var extend = require("util")._extend;
var obfuscator = require("../index");
var words = require("../Words");

describe("Obfuscator tests", function() {

    before(function () {
        // it("loadConfig", function () {
        //     done();
        // })
    });

    beforeEach(function() {
        //"Вход в тест"
        var newUserwords = ['select','field1'];
        words.setUserWords(newUserwords);

    });

    afterEach(function() {
        //"Выход из теста"
    });

    it("setUserWords",function (done) {
        try{
            var newTestUserWords = ['select','field1'];
            var rightWords = newTestUserWords
                .map(function (word) {
                    return word.toUpperCase()
                });
            words.setUserWords(newTestUserWords);
            expect(words.getUserWords()).to.eql(rightWords);
            words.setUserWords(newTestUserWords.concat('field2'));
            expect(words.getUserWords()).to.eql(rightWords.concat('FIELD2'));
            expect(words.getUserWords()).to.not.eql(rightWords.concat('field2'));
            done();
        } catch (err){
            done(err);
        }    });

    it("matchUserAndSqlWords",function (done) {
        try{
            words.matchUserAndSqlWords(function (matches) {
                expect(matches).to.eql(['SELECT']);
                done();
            });
        } catch (err){
            done(err);
        }
    });

    it("getTableName",function (done) {
        try{
            var text = "CREATE OR REPLACE TABLE name1(id INT, value TEXT);";
            expect(obfuscator.getTableName(text)).to.eql("name1");
            done();
        }catch (err){
            done(err);
        }
    });

    it("appendTableToFields",function (done) {
        try{
            var text = "CREATE OR REPLACE TABLE name1(id INT, value TEXT);";
            obfuscator.appendTableToFields(text)
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

    it("getRandomName",function (done) {
        try {
            var word = words.getRandomName();
            var otherWord = words.getRandomName();
            expect(words.getRandomName()).to.not.eql(words.getRandomName());

            done();
        }catch (err){
            done(err);
        }
    });


    it("getNewName",function (done) {
        try {
            var word = words.getRandomName();
            var similarWord = extend(word);
            var otherWord = words.getRandomName();
            expect(words.getNewName(word)).to.eql(words.getNewName(similarWord));
            expect(words.getNewName(word)).to.not.eql(words.getNewName(otherWord));
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
