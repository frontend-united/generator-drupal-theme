'use strict';

module.exports.askFor = function() {
  return [
    {
      type: 'list',
      name: 'auroraType',
      message: 'What Aurora base would you like to use?',
      choices: ['Aurora', 'Corona', 'Polaris', 'North'],
      default: 'Aurora',
      filter: function( val ) { return val.toLowerCase(); }
    }
  ];
};

module.exports.runCommands = function(Generator) {
  switch (Generator.auroraType) {
    case 'aurora':
      Generator.directory('aurora', 'sass');
      break;
    case 'corona':
      Generator.directory('corona', 'sass');
      break;
  }
}
