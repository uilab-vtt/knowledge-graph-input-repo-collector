const gulp = require('gulp');
const gitDep = require('git-dep');

gulp.task('git-collect', () => {
    return gitDep();
});

gulp.task('collect', ['git-collect']);