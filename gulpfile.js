/*jslint node:true, browser:true, -W030:true */
'use strict';
var gulp = require('gulp'),
  istanbul = require('gulp-istanbul'),
  mocha = require('gulp-mocha');

gulp.task('pre-test', function () {
  return gulp.src(['lib/*.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
  return gulp.src(['test/*.test.js'])
    .pipe(mocha())
    // Creating the reports after tests ran
    .pipe(istanbul.writeReports())
    // Enforce a coverage of at least 90%
    .pipe(istanbul.enforceThresholds({
      /*thresholds: {
        global: 90
      }*/
    }));
});

gulp.task('mocha', function () {
  return gulp.src(['test/*.test.js'])
    .pipe(mocha());
});

