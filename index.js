/*

 */

var fs = require("fs");
var obfuscator = require("./Obfuscator");
var words = require("./Words");
var path = require("path");

var inputFilename = obfuscator.inputFilename;
var outputFilename = obfuscator.outputFilename;

/**
 * Main obfuscator method
 */
function sqlSymmetricObfuscator() {

    obfuscator.showSettings();

    console.log('obfuscation started...');

    fs.readFile(path.resolve(__dirname, inputFilename), {encoding: 'utf8'}, function (err, data) {
        if (err) throw err;
        console.log("in " + inputFilename );
        obfuscator.obfuscate(data,function (obfuscatedData) {

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
    //console.log("Input and output words\n" + inputOutputWords.inputWords +"\n" +  inputOutputWords.outputWords );
}

module.exports = {
    sqlSymmetricObfuscator: sqlSymmetricObfuscator,
    sqlDeobfuscation:   sqlDeobfuscation
};

/**
 * Run if exec 'node thisModuleName'
 */
if(require.main === module){
    sqlSymmetricObfuscator();
}
