/*

 */

function sqlDeobfuscation() {
    console.log('deobfuscation started...');
}

function sqlSymmetricObfuscator() {
    console.log('obfuscation started...');
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
