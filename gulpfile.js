const gulp =require('gulp');
const {series} = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const eslint = require('gulp-eslint');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');


function styles(cb) {
  gulp.src('sass/**/*.scss')
      .pipe(sass({outputStyle: 'compressed'}))
      .on('error', sass.logError)
      .pipe(
          autoprefixer({
            browserlist: ['last 2 versions'],
          })
      )
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
  cb();
}


function watch() {
  gulp.watch('sass/**/*.scss', gulp.parallel(styles));
  gulp.watch('sass/**/*.scss').on('change', reload);
  gulp.watch('*.html').on('change', reload);
  gulp.watch('js/**/*.js', gulp.series(lint));
  browserSync.init({
    server: './',
  });
}


function lint(cb) {
  gulp.src(['js/**/*js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  cb();
}


function copyHtml(cb) {
  gulp.src('index.html')
      .pipe(gulp.dest('dist'));
  cb();
}


function copyImages(cb) {
  gulp.src('img/*')
      .pipe(imagemin({
        progressive: true,
        use: imageminPngquant(),
      }))
      .pipe(gulp.dest('dist/img'));
  cb();
}

exports.default = series(styles, lint, copyHtml, copyImages, watch);
exports.styles = styles;
exports.copyHtml = copyHtml;
exports.copyImages = copyImages;
