let fs = require("fs");
let path = require("path");

let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}

function organizeFn(dirPath) {
    console.log("nero");
    // 1. Check whether given directory path is valid or not
    // 2. Create organized_files named directory in the given input directory path
    // 3. identify catergory of all the files present in the input directory 
    // 4. copy/cut files to that organized_files directory 
    // 5. All the files will be organized finally.
    
    let doesExist = fs.existsSync(dirPath);

    if(dirPath == undefined) {
        // console.log("Kindly enter the directory Path");
        dirPath = process.cwd();
        // return;
    }

    // if(!doesExist) {
    //     console.log("Kindly enter a correct path");
    //     return;
    // }

    let desPath = path.join(dirPath, "organized_files");
    if(!fs.existsSync(desPath)) fs.mkdirSync(desPath);
    organizeHelper(dirPath, desPath);
}

function organizeHelper(src, dest) {
    let childNames = fs.readdirSync(src);  
    console.log(childNames);
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

module.exports = {
    organizeKey: organizeFn
}