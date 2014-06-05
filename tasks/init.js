var gulp = require('gulp');
var exec = require('gulp-exec');

gulp.task('init-bower', function() {
    var cmd = 'bower install';



    return gulp.src('', { read: false })
        .pipe(exec(cmd, {
            continueOnError: true,
            pipeStdout: true,
            customTemplatingThing: 'bower'
        }));
});

gulp.task('init', ['init-bower'], function() {
    var files = 'bower_components/yui3/build/**';

    return gulp.src(files)
        .pipe(gulp.dest('build'));
});