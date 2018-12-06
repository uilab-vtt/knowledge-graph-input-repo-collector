const fs = require('fs');
const gulp = require('gulp');
const gitDep = require('git-dep');
const path = require('path');
const log = require('fancy-log');
const spawn = require('child_process').spawn;
const sources = require('./sources.json');
const filenames = require('./source-filenames.json');
const pythonSetup = require('./gulp/python-setup');
const validate = require('./gulp/validate');
const report = require('./gulp/validation-report');
const graph = require('./gulp/build-graph');

const validatorPath = './repositories/validator';
const builderPath = './repositories/builder';
const validationReportPath = './validation-report.md';
const validationResultPath = './valid-files.json';

gulp.task('validator-setup-env', async () => {
  if (fs.existsSync(path.join(validatorPath, 'env'))) {
    return;
  } 
  await pythonSetup.env(validatorPath);
});

gulp.task('validator-setup-dependencies', ['validator-setup-env'], async () => {
  await pythonSetup.pip(validatorPath);
});

gulp.task('validator-setup', ['validator-setup-env', 'validator-setup-dependencies']);

gulp.task('builder-setup-env', async () => {
  if (fs.existsSync(path.join(builderPath, 'env'))) {
    return;
  }
  await pythonSetup.env(builderPath);
});

gulp.task('builder-setup-dependencies', ['builder-setup-env'], async () => {
  await pythonSetup.pip(builderPath);
});

gulp.task('builder-setup', ['builder-setup-env', 'builder-setup-dependencies']);

gulp.task('validate-repositories', ['validator-setup'], callback => {
  const validFileSources = {};
  Promise.all(sources.map(source => {
    log(
      '[validate-repositories]',
      `Validate source ${source.id}.`,
    );
    return Promise.all(filenames.map(filename => {
      const filePath = path.join(
        './repositories', 
        source.id, 
        'data', 
        `${filename}.jsonl`,
      );
      return validate(validatorPath, filePath)
        .then(() => {
          if (validFileSources[filename] === undefined) {
            validFileSources[filename] = {};
          }
          validFileSources[filename][source.id] = filePath;
          return null;
        })
        .catch(error => {
          return { filename, error };
        });
    }))
      .then(fileErrors => {
        return fileErrors.filter(fe => fe !== null);
      });
  }))
    .then(errors => {
      log(
        '[validate-repositories]',
        `Finished all validation tasks.`,
      );
      return errors.map((error, i) => ({
        source: sources[i],
        error,
      }));
    })
    .then(sourceErrors => report(filenames, sourceErrors))
    .then(reportContent => {
      fs.writeFileSync(validationReportPath, reportContent);
      log(
        '[validate-repositories]',
        `Saved the validation report at "${validationReportPath}".`,
      );
      fs.writeFileSync(validationResultPath, JSON.stringify(validFileSources));
      callback();
    });
});

gulp.task('build-graphs', ['builder-setup'], async () => {
  await graph.reset(builderPath);
  await graph.initialize(builderPath);
});

gulp.task('git-collect', () => {
  return gitDep();
});

gulp.task('fetch', ['git-collect']);
gulp.task('validate', ['validate-repositories']);
gulp.task('build', ['build-graphs']);