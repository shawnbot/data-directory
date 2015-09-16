var assert = require('assert');
var load = require('../');
var path = require('path');
var localDataPath = path.join(__dirname, '_data');
describe('load()', function() {

  it('reads data', function(done) {
    load(localDataPath, function(error, data) {
      assert.deepEqual(data.test, {foo: 'bar'});
      done();
    });
  });

});
