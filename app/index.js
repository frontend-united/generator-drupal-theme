'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var sh = require('execSync');
var _s = require('underscore.string');
var fs = require('fs');

var extras = require('../extras/extras.js');

// Here, we add in extra prompts and settings from our base themes.
var baseThemeList = [
  { name: "No Base Theme", value: null },
  { name: "Zen", value: "zen"},
  { name: "Aurora", value: "aurora", file: "../aurora/Aurora.js", generator: "drupal-theme:aurora" },
  { name: "Omega 4.x", value: "omega" },
  { name: "Mothership", value: "mothership"},
  { name: "Custom", value: "CUSTOM"}
];


var DrupalThemeGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        //sh.run('bundle install --path .vendor/bundle');
      }

      //////////////////////////////
      // If the --git flag is passed, initialize git and add for initial commit
      //////////////////////////////
      if (this.options['git']) {
        sh.run('git init');
        sh.run('git add . && git commit -m "Aurora Generation"');
      }
    });
  }
});

DrupalThemeGenerator.prototype.askForBase = function () {
  var done = this.async();

  // Have Yeoman greet the user.
  this.log(yosay('Welcome to the Drupal base theme generator!'));

  var prompts = [
    {
      type: 'string',
      name: 'projectName',
      message: 'What\'s your theme\'s name?' + chalk.red(' (Required)'),
      validate: function (input) {
        if (input === '') {
          return 'Please enter your theme\'s name';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'baseTheme',
      message: 'Which base theme would you like to use?',
      choices: baseThemeList,
      default: null,
    },
    {
      type: 'string',
      name: 'customBaseTheme',
      message: 'What is the system name of the base theme?',
      when: function( answers ) {
        return (answers.baseTheme === "CUSTOM");
      }
    }
  ];

  this.prompt(prompts, function (props) {
    this.projectName = props.projectName;
    this.projectSlug = _s.slugify(props.projectName);
    this.baseTheme = props.baseTheme;

    // We have a custom base theme, just set it.
    if (this.baseTheme === "CUSTOM") {
      this.baseTheme = props.customBaseTheme;
    }

    this.config.set('projectName', this.projectName);
    this.config.set('projectSlug', this.projectSlug);
    this.config.set('baseTheme', this.baseTheme);

    done();
  }.bind(this));
};

DrupalThemeGenerator.prototype.askForSubs = function() {
  var done = this.async();
  var baseTheme = this.baseTheme;
  var baseThemeConfig = null;
  var baseThemeGenerator = false;

  baseThemeList.forEach( function(element, index, array) {
    if (element.value == baseTheme) {
      if (element.file != undefined) {
        baseThemeConfig = require(element.file);
      }

      if (element.generator != undefined) {
        baseThemeGenerator = element.generator;
      }
    }
  });

  this.baseThemeGenerator = baseThemeGenerator;

  // We do not want to try and get more options if they do not exist.
  if (baseThemeConfig !== null) {
    var prompts = baseThemeConfig.askFor();
    this.prompt(prompts, function (props) {
      this.baseThemeSettings = props;
      this.config.set('baseThemeSettings', this.baseThemeSettings);

      done();
    }.bind(this));
  }
  else {
    done();
  }
};

DrupalThemeGenerator.prototype.askForAdvanced = function() {
  var done = this.async();
  var onlyWhen = function( answers ) {
    return answers.advFileOptions;
  }

  // First, set our general defaults.
  this.sassDir = 'sass';
  this.cssDir = 'css';
  this.jsDir = 'js';
  this.fontsDir = 'fonts';
  this.templateDir = 'tpl';

  this.prompt([
    {
      type: "confirm",
      name: "advFileOptions",
      message: "Do you want to customize your theme's directories?",
      default: false
    },
    {
      type: "input",
      name: "sassDir",
      message: "Sass directory?",
      default: this.sassDir,
      when: onlyWhen
    },
    {
      type: "input",
      name: "cssDir",
      message: "CSS directory?",
      default: this.cssDir,
      when: onlyWhen
    },
    {
      type: "input",
      name: "jsDir",
      message: "JavaScript directory?",
      default: this.jsDir,
      when: onlyWhen
    },
    {
      type: "input",
      name: "fontsDir",
      message: "Fonts directory?",
      default: this.jsDir,
      when: onlyWhen
    },
    {
      type: "list",
      name: "templateDir",
      message: "Template directory?",
      choices: ['tpl', 'templates'],
      default: this.templateDir,
      when: onlyWhen
    }
  ], function (props) {

    // If they wanted the advanced options, use those.
    if (props.advFileOptions) {
      // TODO: Instead, make sure the input is sanitized already?
      this.sassDir = _s.slugify(props.sassDir);
      this.cssDir = _s.slugify(props.cssDir);
      this.jsDir = _s.slugify(props.jsDir);
      this.fontsDir = _s.slugify(props.fontsDir);
      this.templateDir = props.templateDir;
    }

    this.config.set('sassDir', this.sassDir);
    this.config.set('cssDir', this.cssDir);
    this.config.set('jsDir', this.jsDir);
    this.config.set('fontsDir', this.fontsDir);
    this.config.set('templateDir', this.templateDir);

    done();
  }.bind(this));
};

DrupalThemeGenerator.prototype.askForExtras = function() {
  var done = this.async();

  var prompts = extras.askFor();

  this.prompt(prompts, function (props) {
    this.extraOptions = props.extraOptions;

    done();

  }.bind(this));

};

DrupalThemeGenerator.prototype.drupal = function () {
  // Create our theme directory
  this.mkdir(this.projectSlug);
  // Set our destination to be the new directory.
  this.destinationRoot(this.projectSlug);

  // Make all the directories we know that we will need.
  this.mkdir(this.sassDir);
  this.mkdir(this.cssDir);
  this.mkdir(this.jsDir);
  this.mkdir(this.fontsDir);
  this.mkdir(this.templateDir);

  this.template('_theme.info', this.projectSlug + '.info');
  this.template('_template.php', 'template.php');
};

DrupalThemeGenerator.prototype.extras = function() {
  if (this.extraOptions.length >= 1) {
    // Call the extras generator.
    this.invoke("drupal-theme:extras", {options: {nested: true, extraOptions: this.extraOptions}});
  }
}

DrupalThemeGenerator.prototype.projectfiles = function () {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};

DrupalThemeGenerator.prototype.baseThemeSetup = function () {
  var baseThemeGenerator = this.baseThemeGenerator;

  // Run commands from base theme generators.
  if (baseThemeGenerator) {
    // Call the base theme generator.
    this.invoke(baseThemeGenerator, {options: {nested: true}});
  }
}

module.exports = DrupalThemeGenerator;
