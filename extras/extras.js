'use strict';

module.exports.askFor = function () {
  return [
    {
      type: 'checkbox',
      name: 'extraOptions',
      message: 'What options would you like to include?',
      choices: ['Gulp', 'Bower', 'Grunt'],
      validate: function(value) {
        if (value.indexOf('Gulp') > -1 && value.indexOf('Grunt') > -1) {
          return "You may only select either Gulp or Grunt, not both.";
        }
        else {
          return true;
        }
      }
    }
  ];
}
