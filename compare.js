const fs = require('fs');
const path = require('path');

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
      const content = fs.readFileSync(sourcePath, 'utf8');

      // Write the content to the corresponding file in folder B
      fs.writeFileSync(destinationPath, content);
    } else {
      // Recursively copy content for nested folders
      fs.mkdirSync(destinationPath, { recursive: true });
      copyContent(sourcePath, destinationPath);
    }
  });
}

const folderA = 'src';
const folderB = 'tmp';

module.exports = copyContent;