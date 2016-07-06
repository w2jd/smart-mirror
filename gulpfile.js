var gulp = require('gulp'),
del = require('del'),
htmlmin = require('gulp-htmlmin'),
ngTemplates = require('gulp-ng-templates'),
cssmin = require('gulp-minify-css'),
uglify = require('gulp-uglify'),
karma = require('karma').server,
concat = require('gulp-concat'),
jshint = require('gulp-jshint'),
gulpif = require('gulp-if'),
zip = require('gulp-zip'),
path = require('path'),
browserSync = require('browser-sync'),
pkg = require('./package.json'),
reload = browserSync.reload,
exec = require('gulp-exec');

gulp.task('default', ['lint'], function() {

});

/**
 * Running Bower
 */
gulp.task('bower', function() {
  exec('bower install');
})

/**
 * Cleaning dist/ folder
 */
gulp.task('clean', function(cb) {
  del(['dist/**'], cb);
})

/**
 * Running livereload server
 */
gulp.task('server', function() {
  browserSync({
    server: {
     baseDir: './'
    }
  });
})

/**
 * JSLint/JSHint validation
 */
gulp.task('lint', function() {
  return gulp.src('./js/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
})

/**
 * Karma testing
 */
gulp.task('karma', function(done) {
  karma.start({
    configFile: __dirname + '/config/karma.conf.js',
    singleRun: true
  }, done);
})
gulp.task('karma:watch', function(done) {
  karma.start({
    configFile: __dirname + '/config/karma.conf.js'
  }, done);
})

/** JavaScript compilation */
gulp.task('js', function() {
  return gulp.src(['app/*.js', 'index.html'])
  .pipe(gulpif(/\.html$/, htmlmin({ collapseWhitespace: true })))
  .pipe(gulpif(/\.html$/, ngTemplates()))
  .pipe(concat('app.js'))
  .pipe(gulp.dest('dist'));
})
gulp.task('js:min', function() {
  return gulp.src(['app/*.js', 'index.html'])
  .pipe(gulpif(/\.html$/, htmlmin({ collapseWhitespace: true })))
  .pipe(uglify({ mangle: false }))
  .pipe(concat('app.js'))
  .pipe(gulp.dest('dist'));
})

/**
 * Compiling resources and serving application
 */
gulp.task('serve', ['clean', 'lint', 'karma', 'js', 'server'], function() {
  return gulp.watch([
    'js/*.js', '*.html'
  ], [
   'lint', 'karma', 'js', browserSync.reload
  ]);
})
gulp.task('serve:minified', ['clean', 'lint', 'karma', 'js:min', 'server'], function() {
  return gulp.watch([
    'js/*.js', '*.html'
  ], [
   'lint', 'karma', 'js:min', browserSync.reload
  ]);
})

/**
 * Test Driven Development using Karma and JSHint
 */
gulp.task('tdd', ['lint'], function() {
  return gulp.watch([
    'js/*.js', '*.html'
  ], [
    'lint', 'karma'
  ]);
})

/**
 * Packaging compiled resources
 */
gulp.task('package', ['clean', 'lint', 'karma', 'js:min'], function() {
  return gulp.src(['index.html', 'dist/**', 'libs/**'], { base: './' })
  .pipe(zip(pkg.name + '-' + pkg.version + '.zip'))
  .pipe(gulp.dest('dist'));
});
