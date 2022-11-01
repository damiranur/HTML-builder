const fs = require('fs');
const path = require('path');
const process = require('process');
const input = process.stdin;
const output = process.stdout;
const readline = require('readline');

let link = path.join(__dirname, 'text.txt');
const file = fs.createWriteStream(link);
const readlines = readline.createInterface({input, output});
readlines.write(
  'Please, enter your text. To exit enter "Ctrl + C" or  enter "exit"',
);

readlines.addListener('line', (input) => {
  if (input === 'exit') {
    readlines.write('Good Bye!');
    process.exit(0);
  }
  file.write(input);
});
readlines.addListener('close', () => {
  readlines.write('Good Bye!');
  process.exit(0);
});
