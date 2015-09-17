var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var gulpprint = require('gulp-print');
var gulpif = require('gulp-if');
var args = require('yargs').argv;
var plumber = require('gulp-plumber');

var env = 'prod';

var paths = {
  sass: ['./scss/**/*.scss', './www/lib/ionic/scss/*.scss'],
  js: ['./www/app/app.js',
    './www/app/**/*.js'
  ],
  vendor: ['./vendor/*.js'],
  css: './www/css/'
};

gulp.task('default', ['sass', 'scripts', 'watch'], function() {
  env = 'dev';
  var envPath = './environments/' + env + '/*.js';
  gulp.src(envPath)
    .pipe(concat('env.js'))
    .pipe(gulp.dest('./www/js'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./www/build/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))

    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./www/build/css/'))
    .on('end', done);
});

gulp.task('scripts', function() {
  gulp.src(paths.js)
    .pipe(concat('app.full.js'))
    .pipe(gulp.dest('./www/build/js'));

  gulp.src(paths.vendor)
    .pipe(concat('app.vendor.js'))
    .pipe(gulp.dest('./www/build/js'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['scripts']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('vet', function() {
  log('Analyzing source with JSHint and JSCS');

  // Need to clean up what JS I'm looking at as to not driving myself insane
  return gulp
    .src([
      './www/js/**/*.js',
      './gulpfile.js'
    ])
    .pipe(gulpif(args.verbose, gulpprint()))
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe(jshint.reporter('fail'));
});

////////// Non-gulp helper functions /////////

function log(msg) {
  if (typeof(msg) === 'object') {
    for (var item in msg) {
      if (msg.hasOwnProperty(item)) {
        gutil.log(gutil.colors.blue(msg[item]));
      }
    }
  } else {
    gutil.log(gutil.colors.blue(msg));
  }
}
