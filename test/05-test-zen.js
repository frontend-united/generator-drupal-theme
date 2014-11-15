/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Zen Sub-theme', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('drupal-theme:app', [
        '../../app',
        '../../zen',
        '../../extras'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      // add files you expect to exist here.
      'art.info',
      'template.php',
      // We don't want to test all files, but important ones.
      'sass-extensions/zen-grids/zen-grids.gemspec',
      'sass/_init.scss',
      'images-source/screenshot.psd'
    ];

    helpers.mockPrompt(this.app, {
      'projectName': 'Art',
      'baseTheme': 'zen',
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
