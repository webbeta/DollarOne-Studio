var config = require('./config'),

    gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    addsrc = require('gulp-add-src'),
    clean = require('gulp-clean'),
    gulpif = require('gulp-if'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    server = require('gulp-express');

var js = [
    'src/js/vendor/jquery/jquery.js',
    'src/js/vendor/angular/angular.js',
    'src/js/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
    'src/js/vendor/bootstrap-sass/**/*.js',
    'src/js/vendor/dollar-one/**/*.js',
    'src/js/vendor/paper/**/*.js',
    'src/js/vendor/ng-notify/**/*.js',
    'src/js/vendor/slug/*.js',
    'src/js/app.js',
    'src/js/directives/**/*.js',
    'src/js/controllers/**/*.js',
    'src/js/factories/**/*.js'
];

var appDir = config.debug ? config.deploy.dev.app_dir : config.deploy.prod.app_dir,
    assetsDir = config.debug ? config.deploy.dev.assets_dir : config.deploy.prod.assets_dir;

gulp.task('server', ['watch'], function() {
    server.run(['server/app.js']);

    gulp.watch(['./src/**'], function() {
        server.stop();
        server.run(['server/app.js']);
    });
});

gulp.task('bower', function() {
    require('bower-installer');
});

gulp.task('js', function() {
    gulp.src(js)
        .pipe(concat('default.js'))
        .pipe(gulpif(!config.debug, uglify()))
        .pipe(gulp.dest(assetsDir));
});

gulp.task('css', function() {
    gulp.src('src/scss/default.scss')
        .pipe(sass())
        .pipe(addsrc.append('./src/css/vendor/**/*.css'))
        .pipe(addsrc.append('./src/css/module/**/*.css'))
        .pipe(autoprefixer())
        .pipe(concat('default.css'))
        .pipe(gulpif(!config.debug, minifyCss({compatibility: 'ie10'})))
        .pipe(gulp.dest(assetsDir));
});

gulp.task('html', function() {
    gulp.src('./src/html/*.*')
        .pipe(gulp.dest(appDir));

    gulp.src('./src/html/*.*')
        .pipe(gulp.dest(appDir));
});

gulp.task('img', function() {
    gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest(assetsDir + '/img'));
});

gulp.task('fonts', function() {
    gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest(assetsDir + '/fonts'));
});

/** CLEAN */

gulp.task('clean', function () {
    gulp.src('app/')
        .pipe(clean());
    gulp.src('bower_components/')
        .pipe(clean());
    gulp.src('src/**/vendor/')
        .pipe(clean());
});

/** WATCH */
gulp.task('dist', ['css', 'js', 'html', 'img', 'fonts']);

gulp.task('watch', ['dist'], function() {
    gulp.watch(['./src/**'], ['dist']);
});

gulp.task('default', ['watch']);