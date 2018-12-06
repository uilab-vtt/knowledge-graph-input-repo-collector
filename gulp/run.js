const spawn = require('child_process').spawn;



module.exports = function run(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args, { stdio: 'inherit', ...options });
    process.on('exit', code => {
      if (code !== 0) {
        reject(code);
      } else {
        resolve(code);
      }
    })
  });
};