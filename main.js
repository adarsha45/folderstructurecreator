const fs = require('fs');
const path = require('path');
const jsonFilePath = 'structure.json';
const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
const structure = JSON.parse(jsonContent);
const filePath = 'output.txt';
//-------------------------filetype doesnot suppert
fs.readFile(filePath, 'utf16le', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const lines = data.split('\n');
  const contents = []
  lines.forEach((line) => {
    console.log(line)
    const a = line.split('/')
    console.log(a)
    contents.push(a)
});
console.log(contents)
//contents.splice(-1)
  contents.forEach((content)=>{
    console.log(content)
    var fname = content[2]    // src/layout/filename.xml
    console.log(fname)
    if (fname.includes('.')) {
      fname = fname.split('.')[0];
      console.log(fname); 
    } else {
      fname = fname
    }
    console.log(fname)

    // const tName = fname.split('.')
    let componentName = content[1]
    console.log(componentName)
    let textName = fname
    createFolderStructure(componentName,textName)
    console.log(textName)
  })
});


//-------------------------------------------------------------------------------------------------------------------folderstructure---------------------
const createFolderStructure = ((componentToCreate,filename)=>{
  let fileType;
if (structure.src.hasOwnProperty(componentToCreate)) {
  fileType = componentToCreate;
} else {
  console.log(`Invalid file type: ${componentToCreate}`);
  //process.exit(1);
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
} 
else if (fileType === 'aura') {
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

})
//----------------------------------------------------comparefunction --------------still cannot export 


function copyContent(sourceDir,destinationDir) {
  const files = fs.readdirSync(destinationDir);

  files.forEach(file => {
    console.log(file)
    const sourcePath = path.join(sourceDir, file);
    const destinationPath = path.join(destinationDir, file);

    const isFile = fs.statSync(destinationPath).isFile();

    if (isFile) {
      const content = fs.readFileSync(sourcePath, 'utf8');

      fs.writeFileSync(destinationPath, content);
    } else {
      fs.mkdirSync(destinationPath, { recursive: true });
      copyContent(sourcePath, destinationPath);
    }
  });
}
const folderA = 'srce';
const folderB = 'src';

setTimeout(copyContent, 5000, folderA,folderB); // 
//Call the greet() function with the argument 'John' after a delay of 2000 milliseconds (2 seconds) cause due to async it is running at omega n-
//call the content class but works  after n-- 