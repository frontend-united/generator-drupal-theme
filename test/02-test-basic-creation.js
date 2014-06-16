/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Basic drupal theme (no base theme)', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('drupal-theme:app', [
        '../../app',
        '../../extras'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      'tester-apples.info',
      'template.php',
      '.jshintrc',
      'favicon.ico',
      '.gitignore',
      '.editorconfig'
    ];

    helpers.mockPrompt(this.app, {
      'projectName': 'TeStEr  Apples',
      'baseTheme': null,
      'advFileOptions': false,
      'extraOptions': []
    });
    this.app.options['skip-install'] = true;
    this.app.options['skip-welcome-message'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
