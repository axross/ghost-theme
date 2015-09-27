import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import watchify from 'gulp-watchify';
import babelify from 'babelify';
import uglifyify from 'uglifyify';
import buffer from 'vinyl-buffer';
import stylus from 'gulp-stylus';
import csso from 'gulp-csso';
import autoprefixer from 'gulp-autoprefixer';

const environment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
let isWatching = false;

console.info(`Now environment is ${environment}`);

gulp.task('watch-enable', () => { isWatching = true });

gulp.task('transpile:js', watchify(bundle => {
  return gulp.src('./sources/javascripts/**/*.js')
    .pipe(plumber({
      errorHandler(dest) {
        notify.onError({
          title:   'Gulp Error: transpile:js',
          message: '<%= error.message %>',
        })(dest);

        dest.codeFrame && console.log(dest.codeFrame);
        this.emit('end');
      },
    }))
    .pipe(bundle({
      extensions: ['.es6', '.json'],
      transform: [babelify, uglifyify],
      debug: true,
      watch: isWatching,
    }))
    .pipe(buffer())
    .pipe(rename({ extname: '.js' }))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./ghost/content/themes/custom/assets/js'));
}));

gulp.task('transpile:css', () => {
  return gulp.src('./sources/main.styl')
    .pipe(plumber({
      errorHandler(dest) {
        notify.onError({
          title:   'Gulp Error: transpile:css',
          message: '<%= error.message %>',
        })(dest);

        this.emit('end');
      },
    }))
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(csso())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(rename('bundle.css'))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./ghost/content/themes/custom/assets/css'));
});

gulp.task('copy:templates', () => {
  return gulp.src('./sources/**/*.hbs')
    .pipe(gulp.dest('./ghost/content/themes/custom'));
});

gulp.task('copy:images', () => {
  return gulp.src('./sources/images/*')
    .pipe(gulp.dest('./ghost/content/themes/custom/assets/img'));
});

gulp.task('bundle', [
  'transpile:css',
  'transpile:js',
  'copy:templates',
  'copy:images'
]);
gulp.task('build', ['bundle']);

gulp.task('watch', ['watch-enable', 'bundle'], function() {
  gulp.watch('./sources/**/*.styl', ['transpile:css']);
  gulp.watch('./sources/**/*.hbs', ['copy:templates']);
  gulp.watch('./sources/images/*', ['copy:images']);
});
