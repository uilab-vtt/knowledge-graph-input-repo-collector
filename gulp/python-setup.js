const run = require('./run');

module.exports = {
  env: async function env(path) {
    try {
      await run('python3', ['-m', 'venv', './env'], { cwd: path });
    } catch (error) {
      throw Error(`Failed to setup Python venv on ${path}`);
    }
  },
  pip: async function pip(path) {
    try {
      await run(
        './env/bin/pip', 
        ['install', '-r', 'requirements.txt'], 
        { cwd: path },
      );
    } catch (error) {
      throw Error(`Failed to run pip install on ${path}.`);
    }
  },
};