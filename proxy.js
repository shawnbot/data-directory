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
      // search for the directory, then the filenames
      var globs = [dir + '/' + name];
      globs.push(globs[0] + '.{' + formatExtensions + '}');
      // get all the files
      var files = globs.reduce(function(files, pattern) {
        return files.concat(glob.sync(pattern));
      }, []);
      // TODO: warn about ignored files here?
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
