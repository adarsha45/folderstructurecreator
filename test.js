const fs = require('fs');
const path = require('path');
const jsonFilePath = 'structure.json'
const jsonContent = fs.readFileSync(jsonFilePath,'utf8');
const structure = JSON.parse(jsonContent)

const componentToCreate = 'aura'; // --componentToCreate
const filename = 'ada'; // --filename

let fileType;
if(structure.src.hasOwnProperty(componentToCreate)){
    fileType = componentToCreate
} else {
    console.log(`Invalid file type: ${componentToCreate}`)
    process.exit(1);
}

const baseFolder = path.join(__dirname,'src')
if(!fs.existsSync(baseFolder)){
    fs.mkdirSync(baseFolder)  
    console.log(`created base folder with src i.e ${baseFolder}`)  
}

if(fileType === 'classes'){
    const targetFolder = path.join(baseFolder,'classes');
    if(!fs.existsSync(targetFolder)){
        fs.mkdirSync(targetFolder)
    }
    structure.src[fileType].forEach(file => {
        const filepath = path.join(targetFolder, file.replace('filename',filename))
        fs.writeFileSync(filepath,'','utf8')      
    });
}
