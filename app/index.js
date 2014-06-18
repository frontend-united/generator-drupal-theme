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
  { name: "Zen", value: "zen", generator: "drupal-theme:zen"},
  { name: "Aurora", value: "aurora", file: "../aurora/Aurora.js", generator: "drupal-theme:aurora" },
  { name: "Omega 4.x", value: "omega" },
  { name: "Mothership", value: "mothership"},
  { name: "Custom", value: "CUSTOM"}
];


var DrupalThemeGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      //////////////////////////////
      // Move Yo Storage
      //////////////////////////////
      fs.renameSync('../.yo-rc.json', '.yo-rc.json');

      //////////////////////////////
      // If the --skip-install flag is NOT passed, install our bundler
      // dependencies.
      // NOTE: This happens in a local folder because there is less of a chance
      //       of it breaking there.
      //////////////////////////////
      if (!this.options['skip-install']) {
        sh.run('bundle install --path .vendor/bundle');

        //////////////////////////////
        // If the --skip-compass flag is NOT passed, run compass compile
        //////////////////////////////
        if (!this.options['skip-compass']) {
          sh.run('bundle exec compass compile');
        }
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
  var cb = this.async();

  if (!this.options['skip-welcome-message']) {

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the Drupal theme generator!'));
    this.log(
      chalk.green(
        'With this you can create the scaffolding for your own Drupal theme. This also has custom code to create starter kits from several major base themes. ' + '\n'
      )
    );
  }

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

    cb();
  }.bind(this));
};

DrupalThemeGenerator.prototype.askForSubs = function() {
  var cb = this.async();
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

      cb();
    }.bind(this));
  }
  else {
    cb();
  }
};

DrupalThemeGenerator.prototype.askForAdvanced = function() {
  var cb = this.async();
  var onlyWhen = function( answers ) {
    return answers.advFileOptions;
  }

  // First, set our general defaults.
  this.sassDir = 'sass';
  this.cssDir = 'css';
  this.jsDir = 'js';
  this.imgDir = 'img';
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
      name: "imgDir",
      message: "Images directory?",
      default: this.imgDir,
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
      this.imgDir = _s.slugify(props.imgDir);
      this.fontsDir = _s.slugify(props.fontsDir);
      this.templateDir = props.templateDir;
    }

    this.config.set('sassDir', this.sassDir);
    this.config.set('cssDir', this.cssDir);
    this.config.set('jsDir', this.jsDir);
    this.config.set('imgDir', this.imgDir);
    this.config.set('fontsDir', this.fontsDir);
    this.config.set('templateDir', this.templateDir);

    cb();
  }.bind(this));
};

DrupalThemeGenerator.prototype.askForExtras = function() {
  var cb = this.async();

  var prompts = extras.askFor();

  this.prompt(prompts, function (props) {
    this.extraOptions = props.extraOptions;

    cb();

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
  this.mkdir(this.imgDir);
  this.mkdir(this.fontsDir);
  this.mkdir(this.templateDir);

  // General theme files.
  this.template('_theme.info', this.projectSlug + '.info');
  this.template('_template.php', 'template.php');
  this.template('_theme_settings.php', 'theme_settings.php');
  this.copy('favicon.ico', 'favicon.ico');

  // Compass settings file.
  this.template('_config.rb', 'config.rb');
  this.copy('Gemfile', 'Gemfile');

  // Sample JavaScript file.
  this.copy('script.js', this.jsDir + '/script.js');

  // Some config files we want to have.
  this.copy('editorconfig', '.editorconfig');
  this.copy('gitignore', '.gitignore');
  this.copy('jshintrc', '.jshintrc');

  // Keep all of our folders in git, in case we didn't put something in there.
  var keep = [this.fontsDir, this.templateDir, this.sassDir, this.cssDir, this.imgDir];
  for (var i in keep) {
    this.copy('gitkeep', keep[i] + '/.gitkeep');
  }
};

DrupalThemeGenerator.prototype.extras = function() {
  if (this.extraOptions.length >= 1) {
    var cb = this.async();

    // Call the extras generator.
    this.invoke("drupal-theme:extras", {options: {nested: true, extraOptions: this.extraOptions}}, cb);
  }
}

DrupalThemeGenerator.prototype.baseThemeSetup = function () {
  var baseThemeGenerator = this.baseThemeGenerator;

  // Run commands from base theme generators.
  if (baseThemeGenerator) {
    var cb = this.async();

    // Call the base theme generator.
    this.invoke(baseThemeGenerator, {options: {nested: true}}, cb);
  }
}

module.exports = DrupalThemeGenerator;
