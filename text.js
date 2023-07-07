const fs = require('fs');

const filePath = 'output.txt';

fs.readFile(filePath, 'utf16le', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const lines = data.split('\n');
  const contents = []
  lines.forEach((line) => {
    const a = line.split('/')
    contents.push(a)
});
contents.splice(-1)
  contents.forEach((content)=>{
    console.log(content)
    const fname = content[2]
    const tName = fname.split('.')
    const textName = tName[0]
    console.log(textName)
  })
});
