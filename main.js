#!/usr/bin/env node

let fs = require("fs");
let path = require("path");
let inputArr = process.argv.slice(2);

// console.log(inputArr);

let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}

let command = inputArr[0];
switch(command) {
    case "tree": treeFn(inputArr[1]);
        break;
    case "organize": organizeFn(inputArr[1]);
        break;
    case "help": helpFn();
        break;
    default : console.log("Invalid Input");
        break;
}

function treeFn(dirPath) {
    let doesExist = fs.existsSync(dirPath);

    if(dirPath == undefined) {
        // console.log("Kindly enter the directory Path");
        // dirPath = process.cwd();
        treeHelper(process.cwd(), "")
        return;
    }

    if(!doesExist) {
        console.log("Kindly enter a correct path");
        return;
    }

    treeHelper(dirPath, "");
}

function treeHelper(dirPath, indent) {
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile == true) {
        let fileName = path.basename(dirPath);
        console.log(indent + "├──" + fileName);
    }
    else {
        let dirName = path.basename(dirPath);
        console.log(indent + "└──" + dirName);
        let childrens = fs.readdirSync(dirPath);
        for (let i = 0; i<childrens.length; i++) {
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent + "\t");
        }
    }
}

function organizeFn(dirPath) {
    // 1. Check whether given directory path is valid or not
    // 2. Create organized_files named directory in the given input directory path
    // 3. identify catergory of all the files present in the input directory 
    // 4. copy/cut files to that organized_files directory 
    // 5. All the files will be organized finally.
    
    let doesExist = fs.existsSync(dirPath);

    if(dirPath == undefined) {
        // console.log("Kindly enter the directory Path");
        dirPath = process.cwd();
        return;
    }

    if(!doesExist) {
        console.log("Kindly enter a correct path");
        return;
    }

    let desPath = path.join(dirPath, "organized_files");
    if(!fs.existsSync(desPath)) fs.mkdirSync(desPath);
    organizeHelper(dirPath, desPath);
}

function helpFn() {
    console.log(`
    List of All Commands: 
        node main.js tree "directoryPath" - To display tree structure of a directory
        node main.js organize "directoryPath" - To Organize scattered files according to their file formats
        node main.js help - For help
    `);
}

function organizeHelper(src, dest) {
    let childNames = fs.readdirSync(src);  
    // console.log(childNames);
    for(let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile) {
            // console.log(childNames[i]);
            let category = getCategory(childNames[i]);
            sendFiles(childAddress, dest, category);
        }
    }
}

function sendFiles(srcFilePath, dest, category) {
    let catergoryPath = path.join(dest, category);
    if(!fs.existsSync(catergoryPath)) fs.mkdirSync(catergoryPath);
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(catergoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    fs.unlinkSync(srcFilePath);
}

function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1);
    console.log(ext);
    for (let type in types) {
        let cTypeArray = types[type];
        for(let i = 0; i<cTypeArray.length; i++) {
            if(ext == cTypeArray[i]) {
                return type;
            }
        }
    }
    return "others";
}
