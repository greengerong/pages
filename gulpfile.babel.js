import gulp from 'gulp';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import clean from 'gulp-clean';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import mergeStream from 'merge-stream';

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
        lib: {
            dest: `${projectDest}/lib/`
        }
    };

gulp.task('clean:html', () => {
    return gulp.src([app.html.dest], {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

gulp.task('clean:css', () => {
    return gulp.src([app.css.dest], {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});

gulp.task('clean:es6', () => {
    return gulp.src([app.es6.dest], {
            read: false
        })
        .pipe(clean({
            force: true
        }));
});


gulp.task('css', ['clean:css'], () => {
    let normalize = './node_modules/normalize.css/normalize.css';
    mergeStream(
            gulp.src(normalize),
            gulp.src(app.css.src)
            .pipe(sass())
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

gulp.task('html', ['clean:html'], () => {
    gulp.src(app.html.src)
        .pipe(gulp.dest(app.html.dest));
});

gulp.task('lib', () => {
    let jquery = './node_modules/jquery/dist/jquery.min.js';
    gulp.src([jquery])
        .pipe(gulp.dest(app.lib.dest));

});

gulp.task('es6', ['clean:es6'], () => {
    let polyfill = './node_modules/gulp-babel/node_modules/babel-core/browser-polyfill.js';
    mergeStream(
            gulp.src(polyfill),
            gulp.src(app.es6.src)
            .pipe(babel())
        )
        .pipe(sourcemaps.init())
        .pipe(concat(app.es6.outputFile))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(app.es6.dest));
});


gulp.task('watch', () => {
    gulp.watch(app.html.src, ['html', 'reload']);
    gulp.watch(app.es6.src, ['es6', 'reload']);
    // gulp.watch('images/**/*.(png|jpg|jpeg)', ['images', 'reload']);
    gulp.watch(app.css.src, ['css', 'reload']);
});

gulp.task('build', ['lib', 'css', 'html', 'es6'], () => {

});

gulp.task('serve', ['build', 'watch', 'browserSync']);

gulp.task('default', ['build']);
