const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const rr = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

rr.on('data', (data) => stdout.write(data));
