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
  switch (this.auroraType) {
    case 'aurora':
      this.directory('aurora', 'sass');
      break;
    case 'corona':
      this.directory('corona', 'sass');
      break;
  }
}
