var gulp         = require('gulp');
var concat       = require('gulp-concat');
var stylus       = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');

gulp.task('javascript', function () {
    return gulp.src([
                   'client/development/js/vendor/angular.js',
                   'client/development/js/vendor/angular-route.js',
                   'client/development/js/vendor/**.*',
                   'client/development/js/custom/controllers.js',
                   'client/development/js/custom/services.js',
                   'client/development/js/custom/directives.js',
                   'client/development/js/custom/app.js',
                   'client/development/js/custom/**.*'
               ])
               .pipe(plumber())
               .pipe(concat('main.js'))
               .pipe(plumber.stop())
               .pipe(gulp.dest('client/public/js/'));
});

gulp.task('style:vendor', function () {

    return gulp.src(['client/development/css/vendor/*.css'])
               .pipe(plumber())
               .pipe(concat('vendor.css'))
               .pipe(plumber.stop())
               .pipe(gulp.dest('client/public/styles/'));
});

gulp.task('style:custom', function () {
    return gulp.src(['client/development/css/custom/*.styl'])
               .pipe(plumber())
               .pipe(stylus())
               .pipe(autoprefixer())
               .pipe(concat('main.css'))
               .pipe(plumber.stop())
               .pipe(gulp.dest('client/public/styles/'));
});

gulp.task('templates', function () {
    return gulp.src(['client/development/templates/**.*'])
               .pipe(gulp.dest('client/public/templates/'));
});

gulp.task('images', function () {
    return gulp.src(['client/development/images/**.*'])
               .pipe(gulp.dest('client/public/images/'));
});

gulp.task('default', function () {

    var allTasks = gulp.parallel([
        'images',
        'javascript',
        'style:vendor',
        'style:custom',
        'templates'
    ]);

    allTasks();

    gulp.watch('client/development/**', allTasks);
});