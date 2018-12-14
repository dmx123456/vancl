const gulp = require('gulp');
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const uglyfly = require('gulp-uglyfly');
// 服务器环境搭建;
const connect = require("gulp-connect");
// 代理服务器;
const proxy = require("http-proxy-middleware")
gulp.task("html", () => {
    return gulp.src(["./src/pages/*.html"])
        .pipe(gulp.dest("./dist/pages"));
})
gulp.task("js", () => {
    return gulp.src(["./src/js/*.js"])
        .pipe(gulp.dest("./dist/js"));
})
gulp.task("json", () => {
    return gulp.src(["./src/json/*.json"])
        .pipe(gulp.dest("./dist/json"));
})
gulp.task("sass", () => {
    return gulp.src("./src/sass/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("./dist/css"))
})

gulp.task("watch", () => {
    gulp.watch("./src/pages/*.html", ["html"]);
    gulp.watch("./src/sass/*.scss", ["sass"]);
    gulp.watch("./src/js/*.js", ["js"]);
    gulp.watch("./src/json/*.json", ["json"]);
})

gulp.task("connect", () => {
    connect.server({
        root: './dist',
        port: 8888,
        livereload: true,
        middleware: function (connect, opt) {
            return [
                proxy('/douban', {
                    target: 'https://api.douban.com',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/douban': "/"
                    }
                }),
                proxy('/mogu', {
                    target: 'https://list.mogujie.com',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/mogu': "/"
                    }
                })
            ]
        }
    });
})
gulp.task("default", ["watch", "connect"]);
//es6转es5
// gulp.task("js", () => {
//     // 需求和实现出现了冲突,应该怎么做?
//     return gulp.src("./src/js/*.js")
//         .pipe(sourcemaps.init())
//         .pipe(babel())
//         .pipe(concat("all.js"))
//         .pipe(sourcemaps.write("."))
//         .pipe(gulp.dest("./dist/javascripts"))
// })

//压缩js
// gulp.task("uglyjs", () => {
//     // 需求和实现出现了冲突,应该怎么做?
//     return gulp.src("./dist/javascripts/*.js")
//         .pipe(uglyfly())
//         .pipe(gulp.dest("./dist/minjs"))
// })

// gulp.task("build", ["js", "uglyjs"])