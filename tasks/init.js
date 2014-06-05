var gulp = require('gulp');
var run = require('gulp-run');

gulp.task('init-bower', function() {
    var cmd = 'bower install';

    return gulp.src('', { read: false })
        .pipe(run(cmd));
});

gulp.task('init', ['init-bower'], function() {
    var files = 'bower_components/yui3/build/**';

    return gulp.src(files)
        .pipe(gulp.dest('build'));
});