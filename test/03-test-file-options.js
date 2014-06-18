/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Custom base theme with custom paths', function () {
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
      'tester_oranges.info',
      'template.php',
      'sasssy/.gitkeep',
      'fonti/.gitkeep',
      'stylesheets/.gitkeep',
      'javascripts/script.js',
      'images/.gitkeep',
      'fonti/.gitkeep',
      'templates/.gitkeep'
    ];

    helpers.mockPrompt(this.app, {
      'projectName': 'TesterOranges',
      'baseTheme': 'CUSTOM',
      'customBaseTheme': 'applesauce',
      'advFileOptions': true,
      'sassDir': 'sasssy',
      'cssDir': 'stylesheets',
      'jsDir': 'javascripts',
      'imgDir': 'images',
      'fontsDir': 'fonti',
      'templateDir': 'templates',
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
