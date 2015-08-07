import gulp from 'gulp';
import gulpUtil from 'gulp-util'
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import clean from 'gulp-clean';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import mergeStream from 'merge-stream';
import chalk from 'chalk';

let projectDest = '.tmp',
    app = {
        css: {
            src: 'sass/**/**.scss',
            outputFile: 'all.css',
            dest: `${projectDest}/style/`
        },
        html: {
            src: 'views/**/**.html',
            dest: `${projectDest}/views/`
        },
        es6: {
            src: 'scripts/**/*.js',
            outputFile: 'all.js',
            dest: `${projectDest}/scripts/`
        },
        images: {
            src: ['images/**/*.*'],
            dest: `${projectDest}/style/images/`
        },
        lib: {
            dest: `${projectDest}/lib/`
        },
        build: {
            src: 'gulpfile.babel.js'
        }
    };

let handleError = (error) => {
    gulpUtil.log(chalk.red(error));
};


gulp.task('clean', () => {
    // return gulp.src([projectDest], {
    //         read: false
    //     })
    //     .pipe(clean({
    //         force: true
    //     }));
});


gulp.task('css', () => {
    let normalize = './node_modules/normalize.css/normalize.css',
        // bootstrap = './node_modules/bootstrap/dist/css/bootstrap.min.css',
        carousel3d = './bower_components/carousel-3d/dist/styles/jquery.carousel-3d.default.css';
    mergeStream(
            gulp.src([normalize, carousel3d]),
            gulp.src(app.css.src)
            .pipe(sass())
            .on('error', handleError)
        )
        .pipe(concat(app.css.outputFile))
        .pipe(gulp.dest(app.css.dest));
});

gulp.task('browserSync', (done) => {
    browserSync({
        files: [
            `${projectDest}/**`
        ],
        ghostMode: true,
        startPath: '/views/page.html',
        server: {
            baseDir: ['.tmp/']
        },
        port: 4000,
        open: true
    });
    browserSync.emitter.on('init', done);
});

gulp.task('reload', () => browserSync.reload);

gulp.task('html', () => {
    gulp.src(app.html.src)
        .pipe(gulp.dest(app.html.dest));
});

gulp.task('lib', () => {
    let jquery = './node_modules/jquery/dist/jquery.min.js',
        jcarousel = './node_modules/jcarousel/dist/jquery.jcarousel.min.js',
        jqueryResize = './bower_components/javascript-detect-element-resize/jquery.resize.js',
        waitforimages = './bower_components/waitForImages/dist/jquery.waitforimages.js',
        modernizr = './bower_components/modernizr/modernizr.js',
        carousel3d = './bower_components/carousel-3d/dist/jquery.carousel-3d.js';
    gulp.src([jquery, jqueryResize, , waitforimages, modernizr, carousel3d])
        .pipe(gulp.dest(app.lib.dest));

});

gulp.task('es6', () => {
    let polyfill = './node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js',
        bootstrap = './node_modules/bootstrap/dist/js/bootstrap.min.js';
    mergeStream(
            gulp.src([polyfill]),
            gulp.src(app.es6.src)
            .pipe(babel())
        )
        .pipe(sourcemaps.init())
        .pipe(concat(app.es6.outputFile))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(app.es6.dest));
});

gulp.task('images', () => {
    gulp.src(app.images.src)
        .pipe(gulp.dest(app.images.dest));
});

gulp.task('watch', () => {
    gulp.watch(app.html.src, ['html', 'reload']);
    gulp.watch(app.es6.src, ['es6', 'reload']);
    gulp.watch(app.images.src, ['images', 'reload']);
    gulp.watch(app.css.src, ['css', 'reload']);
    gulp.watch(app.build.src, ['build', 'reload']);
});

gulp.task('build', ['clean', 'lib', 'css', 'html', 'images', 'es6'], () => {

});

gulp.task('serve', ['build', 'watch', 'browserSync']);

gulp.task('default', ['build']);
