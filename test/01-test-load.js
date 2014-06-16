/*global describe, beforeEach, it*/
'use strict';
var assert = require('assert');

describe('Drupal theme generator', function () {
  it('can be imported without blowing up', function () {

    assert(require('../app') !== undefined);
    assert(require('../aurora') !== undefined);
    assert(require('../extras') !== undefined);
    assert(require('../zen') !== undefined);
  });
});
