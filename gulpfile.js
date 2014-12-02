var gulp     = require('gulp'),
    concat   = require('gulp-concat'),
    browser  = require('gulp-browserify'),
    uglify   = require('gulp-uglify'),
    clean    = require('del'),
    CLOBBER  = [];
    
gulp.task('clobber', function (done) {
    clean(CLOBBER, done);
});

gulp.task('build', function () {
    return gulp.src('./lib/index.js').
        pipe(browser()).
        pipe(concat('dnd-acrobat.js')).
        pipe(uglify()).
        pipe(gulp.dest('./'));
});
CLOBBER.push('./pub/dnd-acrobat.js');

gulp.task('default', ['build']);

