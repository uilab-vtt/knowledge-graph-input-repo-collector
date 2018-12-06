const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

const encoding = 'utf8';

module.exports = function validate(validatorPath, dataPath) {
  return new Promise((resolve, reject) => {
    if(!fs.existsSync(dataPath)) {
      reject('Data file not found.');
    } 
    fs.open(dataPath, 'r', (err, fd) => {
      if (err) {
        reject('Failed to read data file.');
      }
      const process = spawn('./env/bin/python', ['validate.py'], {
        cwd: validatorPath,
        stdio: [fd, 'pipe', 'pipe'],
      });

      const stdout = [];
      const stderr = [];
      process.stdout.on('data', data => stdout.push(data.toString(encoding)));
      process.stderr.on('data', data => stderr.push(data.toString(encoding)));

      process.on('exit', code => {
        const out = stdout.join('');
        const err = stderr.join('');
        if (code !== 0) {
          reject(
            `Validator failed with error:\n${out}\nand output:\n${err}`
          );
        } else {
          if (err.trim() === '' && out.trim() === 'Done.') {
            resolve();
          } else {
            reject(`Validation failed:\n${err}`);
          }
        }
      });
    });
  });
};