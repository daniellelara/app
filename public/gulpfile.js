var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');

gulp.task('jshint', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(jshint());
})

gulp.task('sass:expanded', function() {
  return gulp.src('./src/scss/app.scss')
    .pipe(sass({ outputStyle: 'expanded'}))
    .pipe(gulp.dest('css'));
})

gulp.task('sass:compressed', function() {
  return gulp.src('./src/scss/app.scss')
    .pipe(sass({ outputStyle: 'compressed'}))
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('css'));
})

gulp.task('concat', function(){
  return gulp.src(['./src/js/app.js', './src/js/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('js'));
})

gulp.task('uglify', function(){
  return gulp.src('./src/js/app.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('replace:development', function(){
  return gulp.src('./index.ejs')
    .pipe(replace(/app\.min\.js/, 'app.js'))
    .pipe(replace(/app\.min\.css/, 'app.css'))
    .pipe(gulp.dest('./'));
});

gulp.task('replace:production', function(){
  return gulp.src('./index.ejs')
    .pipe(replace(/app\.js/, 'app.min.js'))
    .pipe(replace(/app\.css/, 'app.min.css'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', function(){
  livereload.listen();
    gulp.watch(['./src/**/*', 'index.ejs'], ['sass:expanded', 'sass:compressed', 'concat', 'uglify', 'replace:development', function(){
      livereload.reload('index.html')
    }]);
});