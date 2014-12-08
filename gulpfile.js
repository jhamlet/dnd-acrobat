var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    browser    = require('gulp-browserify'),
    uglify     = require('gulp-uglify'),
    clean      = require('del'),
    CLOBBER    = [];
    
gulp.task('clobber', function (done) {
    clean(CLOBBER, done);
});
CLOBBER.push('pub');

gulp.task('ext', function () {
    return gulp.
        src('./lib/ext/index.js', { read: false }).
        pipe(browser()).
        pipe(uglify()).
        pipe(concat('ext.js')).
        pipe(gulp.dest('pub'));
});

gulp.task('rx', function () {
    return gulp.
        src('./lib/ext/rx.js', { read: false }).
        pipe(browser()).
        pipe(uglify()).
        pipe(concat('ext.rx.js')).
        pipe(gulp.dest('pub'));
});

gulp.task('character', function () {
    return gulp.src('./lib/index.js').
        pipe(browser()).
        pipe(concat('character.js')).
        pipe(gulp.dest('pub'));
});

gulp.task('build', ['ext', 'rx', 'character']);
gulp.task('default', ['build']);

