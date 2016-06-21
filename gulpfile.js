var gulp         = require('gulp');
var concat       = require('gulp-concat');
var sourcemaps   = require('gulp-sourcemaps');
var stylus       = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('javascript', function () {
    return gulp.src(['client/development/js/vendor/*.js', 'client/development/js/custom/*.js'])
               .pipe(sourcemaps.init())
               .pipe(concat('main.js'))
               .pipe(sourcemaps.write())
               .pipe(gulp.dest('client/public'));
});

gulp.task('style:vendor', function () {

    return gulp.src(['client/development/css/vendor/*.css'])
               .pipe(concat('vendor.css'))
               .pipe(gulp.dest('client/public'));
});

gulp.task('style:custom', function () {
    return gulp.src(['client/development/css/custom/*.styl'])
               .pipe(stylus())
               .pipe(autoprefixer())
               .pipe(concat('main.css'))
               .pipe(gulp.dest('client/public'));
});

gulp.task('default', function () {

    gulp.watch('client/development/**', ['javascript', 'style:vendor', 'style:custom']);
});