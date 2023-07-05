const fs = require('fs');
const path = require('path');

const jsonFilePath = 'structure.json';
const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
const structure = JSON.parse(jsonContent);

const fileToCreate = process.argv[2];//'aura'; // --filetocreate
const filename = process.argv[3];//'ada'; // --filename

let fileType;
if (structure.src.hasOwnProperty(fileToCreate)) {
  fileType = fileToCreate;
} else {
  console.log(`Invalid file type: ${fileToCreate}`);
  process.exit(1);
}

const baseFolder = path.join(__dirname, 'src');

if (!fs.existsSync(baseFolder)) {
  fs.mkdirSync(baseFolder);
  console.log(`Created folder: ${baseFolder}`);
}

if (fileType === 'classes') {
  const targetFolder = path.join(baseFolder, fileType);

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
    console.log(`Created folder: ${targetFolder}`);
  }

  structure.src[fileType].forEach((file) => {
    const filePath = path.join(targetFolder, file.replace('filename', filename));
    fs.writeFileSync(filePath, '', 'utf8');
    console.log(`Created file: ${filePath}`);
  });
} else if (fileType === 'aura') {
  const targetFolder = path.join(baseFolder, fileType, filename);

  if (!fs.existsSync(path.join(baseFolder, fileType))) {
    fs.mkdirSync(path.join(baseFolder, fileType));
    console.log(`Created folder: ${path.join(baseFolder, fileType)}`);
  }
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder);
      console.log(`Created folder: ${targetFolder}`);
    }

  structure.src[fileType].Foldername.forEach((file) => {
    const filePath = path.join(targetFolder, file.replace('filename', filename));
    fs.writeFileSync(filePath, '', 'utf8');
    console.log(`Created file: ${filePath}`);
  });
}
