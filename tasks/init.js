var alloy = require('../.alloy');
var gulp = require('gulp');
var gulpFilter = require('gulp-filter');
var path = require('path');
var replace = require('gulp-replace');
var run = require('run-sequence');
var spawn = require('spawn-local-bin');

var ROOT = path.join(__dirname, '..');

gulp.task('init', function(callback) {
    run('init-bower', 'init-npm', 'init-yui', callback);
});

gulp.task('init-bower', function(callback) {
    var args = ['install'];
    var cmd = 'bower';
    var cwd = ROOT;

    spawn(cmd, args, cwd)
        .on('exit', function() {
            callback();
        });
});

gulp.task('init-npm', function(callback) {
    var args = ['install'];
    var cmd = 'npm';
    var cwd = ROOT;

    spawn(cmd, args, cwd)
        .on('exit', function() {
            callback();
        });
});

gulp.task('init-yui', function() {
    var filter = gulpFilter('!**/*.png');

    return gulp.src('bower_components/yui3/build/**', { cwd: ROOT })
        .pipe(filter)
        .pipe(replace('@VERSION@', alloy.yuiversion))
        .pipe(filter.restore())
        .pipe(gulp.dest('build', { cwd: ROOT }));
});