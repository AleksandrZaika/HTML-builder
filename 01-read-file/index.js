const fs = require('fs');
const path = require('path');

const fileLocation = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(fileLocation, { encoding: 'utf-8' });

let content = '';

stream.on('data', (chunk) => {
  content += chunk;
});

stream.on('end', () => {
  console.log(content);
});
