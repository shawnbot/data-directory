var Proxy = require('harmony-proxy');
var fs = require('fs');
var glob = require('glob');
var formats = require('./formats');
var formatExtensions = Object.keys(formats).join(',');

module.exports = function createProxy(dir) {

  var data = Object.create(null);

  var read = function(filename, cached) {
    var stat = fs.statSync(filename);
    if (stat.isDirectory()) {
      return createProxy(filename);
    }
    var format = filename.split('.').pop();
    return formats[format].sync(filename, format);
  };

  var handler = {
    get: function(target, name) {
      var pattern = dir + '/' + name + '.{' + formatExtensions + '}';
      var files = glob.sync(pattern);
      var filename = files[0];
      if (filename) {
        var cached = target[name];
        return target[name] = read(filename, cached);
      } else {
        return undefined;
      }
    }
  };

  return new Proxy(data, handler);
};
