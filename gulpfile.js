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

gulp.task('validate-repositories', ['validator-setup'], async () => {
  try {
    const validFileSources = {};
    const errors = await Promise.all(sources.map(async source => {
      const fileErrors = [];
      for (const filename of filenames) {
        const filePath = path.join('./repositories', source.id, 'data', `${filename}.jsonl`);
        log(
          '[validate-repositories]', 
          `Validating "${filename}" of ${source.id}(${source.provider})...`,
        );
        try {
          await validate(validatorPath, filePath);
          if (validFileSources[filename] === undefined) {
            validFileSources[filename] = {};
          }
          validFileSources[filename][source.id] = filePath;
        } catch (error) {
          fileErrors.push({ filename, error });
        }
        log(
          '[validate-repositories]', 
          `Validation done: "${filename}" of ${source.id}(${source.provider}).`,
        );
      }
      return fileErrors;
    }));
    const sourceErrors = errors.map((error, i) => ({
      source: sources[i],
      error,
    }));
    const reportContent = await report(filenames, sourceErrors);
    try {
      fs.writeFileSync(validationReportPath, reportContent);
      log(
        '[validate-repositories]',
        `Saved the validation report at "${validationReportPath}".`,
      );
    } catch (err) {
      log.error(
        '[validate-repositories]',
        'Failed to write the validation report.',
      );
    }
    fs.writeFileSync(validationResultPath, JSON.stringify(validFileSources));

    if (errors.filter(err => err.length > 0).length > 0) {
      log(
        '[validate-repositories]',
        'Validation done with some errors.',
      );
    } else {
      log(
        '[validate-repositories]',
        'Validation done with no errors.',
      );
    }
  } catch (err) {
    log.error(
      '[validate-repositories]',
      'Error occurred on validation process:',
      err,
    );
  }
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