var gulp       = require('gulp');
var concat     = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('javascript', function () {
    return gulp.src(['client/development/vendor/*.js', 'client/development/custom/*.js'])
               .pipe(sourcemaps.init())
               .pipe(concat('main.js'))
               .pipe(sourcemaps.write())
               .pipe(gulp.dest('client/public'));
});

gulp.task('default', function () {

    gulp.watch('client/development/**', ['javascript']);
});