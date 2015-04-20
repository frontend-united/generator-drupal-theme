'use strict';

module.exports.askFor = function() {
  return [
    {
      type: 'list',
      name: 'auroraType',
      message: 'What Aurora base would you like to use?',
      choices: ['Aurora', 'Corona', 'Polaris', 'North', 'Aurora Stylus'],
      default: 'Aurora',
      filter: function( val ) { return val.toLowerCase(); }
    }
  ];
};
