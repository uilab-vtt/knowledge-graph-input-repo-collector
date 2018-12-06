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
  addData: async function addData(builderPath, dataPath) {

  },
  merge: async function merge(builderPath) {

  },
  dump: async function dump(builderPath) {

  },
}