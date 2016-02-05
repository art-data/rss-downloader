const gulp = require('gulp')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const install = require('gulp-install')
const zip = require('gulp-zip')

// first run the 'pub' and 'deps' tasks
// then compile ./src/index.js
// put the output in ./build/index.js
gulp.task('build', ['pub', 'deps'], function () {
  return gulp.src('src/index.js')
         .pipe(babel({
           presets: ['es2015']
         }))
         .pipe(rename('index.js'))
         .pipe(gulp.dest('build'))
})

// copy everything in ./pub into ./build
gulp.task('pub', function (cb) {
  return gulp.src('./pub/**/*')
         .pipe(gulp.dest('build'))
})

// `npm install --production` into ./build
gulp.task('deps', function (cb) {
  return gulp.src('./package.json')
         .pipe(gulp.dest('build'))
         .pipe(install({production: true}))
})

// first run the 'build' task
// then zip everything in ./build
// put the output in ./dist/aws.zip
gulp.task('zip', ['build'], function (cb) {
  return gulp.src('build/**/*')
         .pipe(zip('aws.zip'))
         .pipe(gulp.dest('dist'))
})

// make 'zip' the default task
gulp.task('default', ['zip'])

