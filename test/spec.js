var assert = require('assert');
var load = require('../');
var path = require('path');

var createProxy = require('../proxy');

var localDataPath = path.join(__dirname, '_data');

describe('load()', function() {

  it('reads data', function(done) {
    load(localDataPath, function(error, data) {
      assert.deepEqual(data.test, {foo: 'bar'});
      done();
    });
  });

});

describe('proxy', function() {

  it('creates proxies that read data', function() {
    var data = createProxy(localDataPath);
    assert.deepEqual(data.test, {foo: 'bar'});
  });

});
