const gulp = require('gulp')
const concat = require('gulp-concat')
const minify = require('gulp-minify')
const cleanCSS = require('gulp-clean-css')

gulp.task('js', () =>
  gulp.src(['./js/*.js'])
    .pipe(concat('bundle.js'))
    .pipe(minify())
    .pipe(gulp.dest('dist'))
)

gulp.task('css', () =>
  gulp.src(['./css/*.css'])
    .pipe(concat('stylesheet.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'))
)
