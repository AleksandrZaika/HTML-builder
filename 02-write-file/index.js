const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

const fileLocation = path.join(__dirname, 'text.txt');
const createFile = fs.createWriteStream(fileLocation);

console.log('Hello, please type your text below:');

function processInput() {
  stdin.on('data', (input) => {
    const incomingInput = input.toString().trim();
    if (incomingInput.toLocaleLowerCase() === 'exit') {
      console.log('Thank you, goodbye!');
      exit();
    } else {
      createFile.write(incomingInput);
    };
  });
}

process.on('SIGINT', () => {
  console.log('Thank you, goodbye!');
  exit();
});

processInput();