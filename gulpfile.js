const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const css = require('gulp-clean-css');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const minify = require('gulp-js-minify');
const sass = require('gulp-sass');
const scss = require('gulp-scss');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');


const cleanDist = () => {
    return gulp.src('dist/*/').pipe(clean());
};

const styles = () => {
    return gulp.src('src/scss/main.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(css())
        .pipe(gulp.dest('dist/css/'));
};

const scripts = () => {
    return gulp.src('src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(minify())
        .pipe(gulp.dest('dist/js/'))
};

const images = () => {
    return gulp.src('src/img/*')
        .pipe(gulp.dest('dist/img/'))
};

const refreshPage = (done) => {
    browserSync.init({
        server: "./"
    });


    gulp.watch("src/scss/*.scss", styles).on('change', browserSync.reload);
    gulp.watch("src/js/*.js", scripts).on('change', browserSync.reload);
    gulp.watch("src/img/*", images).on('change', browserSync.reload);
    gulp.watch("index.html").on('change', browserSync.reload);
    done();
};


gulp.task('build', gulp.series(cleanDist, styles, scripts, images));
gulp.task('dev', refreshPage);

exports.default = refreshPage;