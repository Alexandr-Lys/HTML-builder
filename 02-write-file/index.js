const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');

const outputFilePath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(outputFilePath, 'utf-8');

const rlInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function activateRlInterface() {
  rlInterface.question('Enter your message:', answer => {
    if (answer == 'exit') {
      process.stdin.emit('SIGINT');
    } else {
      output.write(`${answer}\n`);
      activateRlInterface();
    }
  });
}

process.stdout.write('Hello!');

process.stdin.on('SIGINT', () => {
  process.stdout.write('\nGoodbye!');
  rlInterface.close();
});
process.stdin.on('keypress', (str, key) => {
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.emit('SIGINT');
  }
});

activateRlInterface();
