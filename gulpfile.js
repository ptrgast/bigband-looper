var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var sass = require("gulp-sass");

var paths = {
    pages: ['src/*.html'],
    css: {
        watch: ['src/css/**/*.scss'],
        build: ['src/css/bigband.scss']
    },
    bootstrap: ['node_modules/bootstrap/dist/css/bootstrap.min.css']
};

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("sass", function() {
    return gulp.src(paths.css.build)
        .pipe(sass())
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-bootstrap", function () {
    return gulp.src(paths.bootstrap)
        .pipe(gulp.dest("dist"));
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
}

gulp.task("default", ["sass", "copy-html", "copy-bootstrap"], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
gulp.watch(paths.css.watch, ['sass']);
gulp.watch(paths.pages, ['copy-html']);