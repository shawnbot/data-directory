var assert = require('assert');
var child = require('child_process');
var datadir = require('../');
var path = require('path');

var localDataPath = path.join(__dirname, '_data');

describe('load()', function() {

  it('reads data', function(done) {
    datadir.load(localDataPath, function(error, data) {
      assert.deepEqual(data.test, {foo: 'bar'});
      done();
    });
  });

});

describe('proxy()', function() {

  this.timeout(5000);

  it('creates proxies that read data', function() {
    var data = datadir.proxy(localDataPath);
    assert.deepEqual(data.test, {foo: 'bar'});
    assert.deepEqual(data.bar.x, {fizz: 'buzz', baz: 'quxx'});
  });

  xit('caches data', function() {
    var data = datadir.proxy(localDataPath);
    var test = data.test;
    assert.strictEqual(data.test, test);
  });

  it('invalidates cached data', function(done) {
    var data = datadir.proxy(localDataPath);

    child.execSync([
      'cp',
      path.join(localDataPath, 'test.yml'),
      path.join(localDataPath, 'invalidated.yml')
    ].join(' '));

    var test = data.invalidated;
    assert.deepEqual(data.invalidated, {foo: 'bar'});

    /**
     * XXX we have to write the file a second later because some
     * filesystems don't support sub-second precision.
     */
    setTimeout(function() {

      child.execSync([
        'echo', '"baz: qux"', '>>',
        path.join(localDataPath, 'invalidated.yml')
      ].join(' '));

      assert.deepEqual(data.invalidated, {foo: 'bar', baz: 'qux'});
      done();

    }, 1001);
  });

});
