'use strict';
var yeoman = require('yeoman-generator');

var extras = require('./extras.js');


var DrupalThemeExtrasGenerator = yeoman.generators.Base.extend({
  init: function () {

    this.on('end', function () {
      if (!this.options['skip-install']) {
        var bower = this.extraOptions.indexOf('Bower') > -1 ? true : false;
        var npm = (this.extraOptions.indexOf('Gulp') > -1 || this.extraOptions.indexOf('Grunt') > -1)  ? true : false;

        if (bower || npm) {
          this.installDependencies({
            bower: bower,
            npm: npm
          });
        }
      }
    });
  }
});

DrupalThemeExtrasGenerator.prototype.askFor = function () {
  var cb = this.async();

  if (!this.options.nested) {
    console.log(this.yeoman);
    var prompts = extras.askFor();

    this.prompt(prompts, function (props) {
      var config = this.config.getAll();

      for (var i in config) {
        this[i] = config[i];
      }

      this.extraOptions = props.extraOptions;

      cb();
    }.bind(this));
  }
  else {
    this.extraOptions = this.options.extraOptions;
    cb();
  }
};

DrupalThemeExtrasGenerator.prototype.addTheThings = function () {
  

}

module.exports = DrupalThemeExtrasGenerator;
