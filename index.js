var path = require('path');
var fs = require('fs');
var async = require('async');
var formats = require('./formats');

module.exports = function load(dir, callback) {
  if (!arguments.length) {
    throw new Error('load() requires at least a callback function');
  } else if (arguments.length < 2) {
    callback = dir;
    dir = '_data';
  }
  if (!dir.match(/^[~\/]/)) {
    dir = path.join(process.cwd(), dir);
  }
  return getData(dir, callback);
};

function getData(dir, done) {
  var data = {};
  async.waterfall([
    function readdir(next) {
      fs.readdir(dir, next);
    },
    function qualifyFilenames(files, next) {
      next(null, files
        // sort the filenames alphabetically
        .sort(ascending)
        // ignore files that begin with _
        .filter(function(filename) {
          return !filename.match(/^_/);
        })
        // prefix them with the directory path
        .map(function(filename) {
          return path.join(dir, filename);
        }));
    },
    function readFiles(filenames, next) {
      async.mapSeries(filenames, function(filename, next) {
        // the name of the data key is the basename minus the extension
        var name = path.basename(filename)
          .replace(/\.[^\.]+$/, '');
        read(filename, function(error, _data) {
          if (error) return next(error);
          // only set the data key if there's data
          // (this allows read() to skip files by returning null)
          if (_data) data[name] = _data;
          next(null, _data);
        });
      }, next);
    }
  ], function(error) {
    return done(error, data);
  });
}

function read(filename, done) {
  fs.stat(filename, function(error, stat) {
    if (error) return done(error);

    if (stat.isDirectory()) {
      // if the file is a directory, read its data recursively
      return getData(filename, done);
    } else {
      // otherwise, ascertain its format using its filename extension
      var format = filename.split('.').pop();

      if (format !== filename && formats.hasOwnProperty(format)) {
        return formats[format](filename, format, done);
      }

      // XXX no data?
      return done();
    }
  });
}

// ascending sort comparator
function ascending(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}
