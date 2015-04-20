'use strict';
var yeoman = require('yeoman-generator');
var rimraf = require('rimraf');
var path = require('path');
var aurora = require('./Aurora.js');


var DrupalThemeAuroraGenerator = yeoman.generators.Base.extend({
  init: function () {

    this.on('end', function () {

    });
  }
});

DrupalThemeAuroraGenerator.prototype.askFor = function () {
  var cb = this.async();

  var config = this.config.getAll();

  for (var i in config) {
    this[i] = config[i];
  }

  if (!this.options.nested) {
    console.log(this.yeoman);
    var prompts = aurora.askFor();

    this.prompt(prompts, function (props) {

      this.auroraType = props.auroraType;

      cb();
    }.bind(this));
  }
  else {
    // Pull the settings from the stored settings array.
    this.auroraType = this.baseThemeSettings.auroraType;

    this.destinationRoot(this.projectSlug);
    cb();
  }
};

DrupalThemeAuroraGenerator.prototype.doThings = function() {
  var cb = this.async();
  var self = this;

  switch (this.auroraType) {
    case 'aurora':
      this.directory('aurora', 'sass');
      break;
    case 'corona':
      this.directory('corona', 'sass');
      break;
    case 'polaris':
      this.directory('polaris', 'sass');
      break;
    case 'north':
        this.copy('north/style.scss', 'sass/style.scss');

        //////////////////////////////
        // North Globals
        //////////////////////////////
        var globals = ['variables', 'functions', 'mixins', 'extends'];
        for (var i in globals) {
	  this.copy('north/all.scss', 'sass/partials/global/_' + globals[i] + '.scss');
	  this.copy('gitkeep', 'sass/partials/global/' + globals[i] + '/.gitkeep');
        }

        //////////////////////////////
        // North Keep
        //////////////////////////////
        var keep = ['sass/partials', 'sass/partials/components', 'sass/partials/layouts', 'sass/enhancements', 'sass/fallbacks'];
        for (var i in keep) {
          this.copy('gitkeep', '' + keep[i] + '/.gitkeep');
        }
        break;
    case 'aurora stylus':
      this.directory('aurora_stylus', '.');
      // Remove no longer needed configuration files
      rimraf(this.destinationRoot() + '/config.rb', function (err) {
        cb();
      });
      rimraf(this.destinationRoot() + '/Gemfile*', function (err) {
        cb();
      });
      rimraf(this.destinationRoot() + '/.vendor', function (err) {
        cb();
      });
      rimraf(this.destinationRoot() + '/.bundle', function (err) {
        cb();
      });
      rimraf(this.destinationRoot() + '/.ruby-version', function (err) {
        cb();
      });
      rimraf(this.destinationRoot() + '/sass', function (err) {
        cb();
      });
      // Declare panels layouts folder
      var info = this.destinationRoot() + '/' + this.projectSlug + '.info',
          file = this.readFileAsString(info);

      file = file + "\n\; ========================================\n"
                  + "\; Panels\n"
                  + "\; ========================================\n"
                  + "plugins[panels][layouts] = panel_layouts";

      this.write(info, file);
      break;
  }

  // Copy the compass config, complete with templating.
  // But first we must remove what is already there.
  if(this.auroraType != 'aurora_stylus') {
    var configpath = path.join(this.destinationRoot() + '/config.rb');
    var gemfilepath = path.join(this.destinationRoot() + '/Gemfile');
    rimraf(configpath, function (err) {
      self.template('_config.rb', 'config.rb');

      rimraf(gemfilepath, function (err) {
        self.copy('Gemfile', 'Gemfile');
        cb();
      });
    });
  }
}

module.exports = DrupalThemeAuroraGenerator;
