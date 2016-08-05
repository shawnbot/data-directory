var assert = require('assert');
var datadir = require('../');
var path = require('path');

var createProxy = require('../proxy');

var localDataPath = path.join(__dirname, '_data');

describe('load()', function() {

  it('reads data', function(done) {
    datadir.load(localDataPath, function(error, data) {
      assert.deepEqual(data.test, {foo: 'bar'});
      done();
    });
  });

});

describe('proxy', function() {

  it('creates proxies that read data', function() {
    var data = datadir.proxy(localDataPath);
    assert.deepEqual(data.test, {foo: 'bar'});
  });

});
