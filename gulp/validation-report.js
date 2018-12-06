const ejs = require('ejs');

function getDateTimeString() {
  const date = new Date(Date.now());
  return `${date.toDateString()} ${date.toTimeString()}`;
}

module.exports = function report(filenames, sourceErrors) {
  const now = getDateTimeString();
  return new Promise((resolve, reject) => {
    ejs.renderFile('./validation-report-template.ejs.md', { filenames, sourceErrors, now }, {}, (err, str) => {
      if (err) {
        reject(err);
      }
      resolve(str);
    });
  });
};