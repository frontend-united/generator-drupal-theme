'use strict';

var gulp = require('gulp');
var prefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var stylish = require('jshint-stylish');
var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var browserSync = require('browser-sync');
var stylus = require('gulp-stylus');
var sourcemaps = require('gulp-sourcemaps');

// Confingure our directories
var sourceJs = 'src_js';
var paths = {
  js:     'js',
  css:    'css',
  styles: 'styles',
  ds:     'ds_layouts',
  panels: 'panel_layouts',
  img:    'img',
};

//////////////////////////////
// Begin Gulp Tasks
//////////////////////////////
gulp.task('lint', function () {
  return gulp.src([
      sourceJs + '/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});

gulp.task('scripts', function() {
  return gulp.src(sourceJs + '/**/*.js')
    // Concatenate everything within the JavaScript folder.
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(paths.js))
    .pipe(rename('scripts.min.js'))
    // Strip all debugger code out.
    .pipe(stripDebug())
    // Minify the JavaScript.
    .pipe(uglify())
    .pipe(gulp.dest(paths.js));
});

//////////////////////////////
// Stylus Tasks
//////////////////////////////
gulp.task('styles', function () {
  gulp.src(paths.styles + '/*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
      paths:  ['node_modules', 'styles/globals'],
      import: ['jeet/stylus/jeet', 'rupture/rupture', 'variables', 'mixins']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css));
});

gulp.task('ds', function () {
  gulp.src(paths.ds + '/**/*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
      paths:  ['node_modules', 'styles/globals'],
      import: ['jeet/stylus/jeet', 'rupture/rupture', 'variables', 'mixins']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.ds));
});

gulp.task('panels', function () {
  gulp.src(paths.panels + '/**/*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
      paths:  ['node_modules', 'styles/globals'],
      import: ['jeet/stylus/jeet', 'rupture/rupture', 'variables', 'mixins']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.panels));
});

//////////////////////////////
// Autoprefixer Tasks
//////////////////////////////
gulp.task('prefix', function () {
  gulp.src(paths.css + '/*.css')
    .pipe(prefix(["last 1 version", "> 1%", "ie 8"]))
    .pipe(gulp.dest(paths.css));
});

//////////////////////////////
// Watch
//////////////////////////////
gulp.task('watch', function () {
  gulp.watch(paths.js + '/**/*.js', ['lint', 'scripts']);
  gulp.watch(paths.styles + '/**/*.styl', ['styles']);
  gulp.watch(paths.ds + '/**/*.styl', ['ds']);
  gulp.watch(paths.panels + '/**/*.styl', ['panels']);
});

//////////////////////////////
// BrowserSync Task
//////////////////////////////
gulp.task('browserSync', function () {
  browserSync.init([
    paths.css +  '/**/*.css',
    paths.ds + '/**/*.css',
    paths.panels + '/**/*.css',
    paths.js + '/**/*.js',
    paths.img + '/**/*',
    paths.fonts + '/**/*',
  ]);
});

//////////////////////////////
// Server Tasks
//////////////////////////////
gulp.task('default', ['scripts', 'watch', 'styles', 'prefix', 'browserSync']);
