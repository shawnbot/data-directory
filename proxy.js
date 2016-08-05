var Proxy = require('harmony-proxy');
var fs = require('fs');
var glob = require('glob');
var formats = require('./formats');
var formatExtensions = Object.keys(formats).join(',');

module.exports = function createProxy(dir, data) {

  if (!data) {
    data = Object.create(null);
  }

  var cache = new Map();

  var read = function(filename) {
    var stat = fs.statSync(filename);
    if (stat.isDirectory()) {
      return createProxy(filename);
    }
    var time = +stat.ctime;
    var cached = cache.get(filename);
    if (cached && cached.time >= time) {
      return cached.data;
    }
    var format = filename.split('.').pop();
    var data = formats[format].sync(filename, format);
    cache.set(filename, {data: data, time: time});
    return data;
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
        return read(filename);
      } else {
        return undefined;
      }
    }
  };

  return new Proxy(data, handler);
};
