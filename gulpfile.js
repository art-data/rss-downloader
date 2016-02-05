const gulp = require('gulp')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const zip = require('gulp-zip')

gulp.task('build', ['pub', 'deps'], function () {
  return gulp.src('src/index.js')
         .pipe(babel({
           presets: ['es2015']
         }))
         .pipe(rename('index.js'))
         .pipe(gulp.dest('build'))
})

gulp.task('pub', function (cb) {
  return gulp.src('./pub/*')
         .pipe(gulp.dest('build'))
})

gulp.task('deps', function (cb) {
  return gulp.src('./node_modules')
         .pipe(gulp.dest('build'))
})

gulp.task('zip', ['build'], function (cb) {
  return gulp.src('build/*')
         .pipe(zip('aws.zip'))
         .pipe(gulp.dest('dist'))
})

gulp.task('default', ['zip'])

