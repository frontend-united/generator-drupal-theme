'use strict';
var chalk = require('chalk');

module.exports.askFor = function() {
  return [
    {
      type: 'list',
      name: 'auroraType',
      message: 'What Aurora base would you like to use?',
      choices: ['Aurora', 'Corona', 'Polaris', 'North'],
      default: 'Aurora'
    }
  ];

};
