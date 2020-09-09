const { src, dest, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const minifyImg =require("gulp-imagemin");
const minifyJS =require("gulp-js-minify");
const cleancss = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const path = {
    src: {
        server: "./src",
        styles: "./src/scss",
        js: "./src/js",
        img: "./src/img",
    },
    dest: {
        server: "./dist/",
        js: "./dist/js",
        img: "./dist/img"
    },
};
const serve = function () {
    browserSync.init({
        server: {
            baseDir: "./",
        },
        port: 5500,
    });
};
const img = function () {
    return src(path.src.img + '/*')
        .pipe(minifyImg())
        .pipe(dest('./dist/img'));
};
// ============================ Dev ====================================
const sassDev = function () {
    return src(path.src.styles + "/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(concat('styles.min.css'))
        .pipe(dest(path.dest.server));
};
const scriptsDev = function () {
    return src(path.src.server + "/**/*.js")
        .pipe(concat("scripts.min.js"))
        .pipe(dest(path.dest.server));
};
const dev = function (cb) {
    serve();
    sassDev();
    scriptsDev();
    img();
    watch("./**/*.html", function (cb) {
        browserSync.reload();
        cb();
    });
    watch(path.src.styles + "/**/*.scss", function (cb) {
        sassDev();
        browserSync.reload();
        cb();
    });
    watch(path.src.js + "/**/*.js", function (cb) {
        scriptsDev();
        browserSync.reload();
        cb();
    });
    cb()
};
// ============================ build =================================
const sassBuild = function () {
    return src(path.src.styles + "/**/*.scss")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(autoprefixer({ browsers: ['last 25 versions'] }))
        .pipe(cleancss())
        .pipe(concat('styles.min.css'))
        .pipe(dest(path.dest.server));
};
const scriptsBuild = function () {
    return src(path.src.server + "/**/*.js")
        .pipe(minifyJS())
        .pipe(concat("scripts.min.js"))
        .pipe(dest(path.dest.server));
};
const build = function(cb) {
    sassBuild();
    scriptsBuild();
    img();
    cb();
};


exports.dev = dev;
exports.build = build;