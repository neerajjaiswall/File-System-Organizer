function helpFn() {
    console.log(`
    List of All Commands: 
        node main.js tree "directoryPath" - To display tree structure of a directory
        node main.js organize "directoryPath" - To Organize scattered files according to their file formats
        node main.js help - For help
    `);
}

module.exports = {
    helpKey: helpFn
}