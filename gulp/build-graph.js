const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const run = require('./run');

module.exports = {
  reset: function reset(builderPath) {
    return new Promise((resolve, reject) => {
      const dbFilePath = path.join(builderPath, 'db.sqlite3');
      if (fs.existsSync(dbFilePath)) {
        fs.unlink(dbFilePath, err => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      }
    });
  },
  initialize: async function initialize(builderPath) {
    try {
      await run(
        './env/bin/pip',
        ['init_db.py'],
        { cwd: builderPath },
      );
    } catch (error) {
      throw Error(`Failed to run init_db.py on builder.`);
    }
  },
  addData: function addData(builderPath, dataPath) {
    return new Promise((resolve, reject) => {
      const fd = fs.openSync(dataPath, 'r');
      const process = spawn('./env/bin/python', ['add_data.py'], {
        cwd: builderPath,
        stdio: [fd, 'pipe', 'pipe'],
      });

      const stdout = [];
      const stderr = [];
      process.stdout.on('data', data => stdout.push(data.toString(encoding)));
      process.stderr.on('data', data => stderr.push(data.toString(encoding)));

      process.on('exit', code => {
        fs.closeSync(fd);
        const out = stdout.join('');
        const err = stderr.join('');
        if (code !== 0) {
          reject(
            `Builder failed with error:\n${out}\nand output:\n${err}`
          );
        } else {
          if (err.trim() === '' && out.trim() === 'Done.') {
            resolve();
          } else {
            reject(`Build failed:\n${err}`);
          }
        }
      });
    });
  },
  merge: async function merge(builderPath) {
    try {
      await run(
        './env/bin/pip',
        ['merge_items.py'],
        { cwd: builderPath },
      );
    } catch (error) {
      throw Error(`Failed to run init_db.py on builder.`);
    }
  },
  dump: function dump(builderPath, dumpPath) {
    return new Promise((resolve, reject) => {
      const fd = fs.openSync(dumpPath, 'w');
      const process = spawn('./env/bin/python', ['dump.py'], {
        cwd: builderPath,
        stdio: ['inherit', fd, 'pipe'],
      });

      const stderr = [];
      process.stderr.on('data', data => stderr.push(data.toString(encoding)));

      process.on('exit', code => {
        fs.closeSync(fd);
        const err = stderr.join('');
        if (code !== 0) {
          reject(
            `Builder failed with error:\n${err}`
          );
        } else {
          resolve(`Build done.\n${err}`);
        }
      });
    });
  },
}