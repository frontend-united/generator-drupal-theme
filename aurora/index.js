'use strict';
var yeoman = require('yeoman-generator');

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
    // Pull the setings from the stored settings array.
    this.auroraType = this.baseThemeSettings.auroraType;

    this.destinationRoot(this.projectSlug);
    cb();
  }
};

DrupalThemeAuroraGenerator.prototype.doThings = function() {

  // Copy the compass config, complete with templating.
  this.template('_config.rb', 'config.rb');
  
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
  }
}

module.exports = DrupalThemeAuroraGenerator;
