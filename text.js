const path = require('path');
var fs = require('fs')
var mkdirp = require('mkdirp')

const packageFilePath = 'upgradepackage/package.txt';
const folderA = 'src';
const folderB = 'temporary/src';

function copyContent(sourceDir, destinationDir) {
  // Read the contents of the destination directory (folder B)
  const files = fs.readdirSync(destinationDir);

  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destinationPath = path.join(destinationDir, file);

    // Check if the current item is a file
    const isFile = fs.statSync(destinationPath).isFile();
  
    if (isFile) {
      // Read the content from the file in folder A
      let content
      setTimeout(function(){
        content = fs.readFileSync(sourcePath, 'utf8');
    },2000);  
      // Write the content to the corresponding file in folder B
      setTimeout(function(){
        fs.writeFileSync(destinationPath, content);
    },5000);  
    } 
    else {
      // Recursively copy content for nested folders
      setTimeout(function(){
        fs.mkdirSync(destinationPath, { recursive: true });
      },2000); 
      setTimeout(function(){
        copyContent(sourcePath, destinationPath);
      },2000); 
    }
  });
}

fs.readFile(packageFilePath, 'utf8', (err, data) => {     
  if (err) {
    console.error('Error reading package.txt:', err);
    return;
  }
  // Split the file contents into an array of file names
  const fileNames = data.split('\n').map((fileName) => fileName.trim()); 
  //console.log(fileNames.length)
  fileNames.forEach(dirs => {
    var a = dirs.split("/")
  //console.log(a)

    var fullName = a.length
    var halfName = a.length - 1

 // console.log(fullName);
 // console.log(halfName);

    const folder = a.slice(0, halfName);
  //console.log(folder)

    var fileStruct = a.join('\\')

    var folderStruct = folder.join('\\')

  //console.log(fileStruct,folderStruct)
    
    const folderStructure = path.join("temporary",folderStruct)
    const fileStructure = path.join("temporary",fileStruct)
    mkdirp.sync(folderStructure)
    fs.writeFileSync(fileStructure,'')
  });
})

copyContent(folderA,"temporary/src");
