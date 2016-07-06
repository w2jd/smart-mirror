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
exec = require('gulp-exec'),
postcss = require('gulp-postcss'),
reporter    = require('postcss-reporter'),
stylelint   = require('stylelint');

var stylelintConfig = {
  "rules": {
    "block-no-empty": true,
    "color-no-invalid-hex": true,
    "declaration-colon-space-after": "always",
    "declaration-colon-space-before": "never",
    "function-comma-space-after": "always",
    "function-url-quotes": "double",
    "media-feature-colon-space-after": "always",
    "media-feature-colon-space-before": "never",
    "media-feature-name-no-vendor-prefix": true,
    "max-empty-lines": 5,
    "number-leading-zero": "never",
    "number-no-trailing-zeros": true,
    "property-no-vendor-prefix": true,
    "declaration-block-no-single-line": true,
    "rule-trailing-semicolon": "always",
    "selector-list-comma-space-before": "never",
    "selector-list-comma-newline-after": "always",
    "selector-no-id": true,
    "string-quotes": "double",
    "value-no-vendor-prefix": true
  }
}

gulp.task('default', ['lint', 'postcss'], function() {

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

var processors = [
  stylelint(stylelintConfig),
  // Pretty reporting config
  reporter({
    clearMessages: true,
    throwError: true
  })
];

gulp.task('postcss', function() {
  return gulp.src(
      // Stylesheet source:
      ['css/**/*.css']
    )
    .pipe(postcss(processors));
});

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
