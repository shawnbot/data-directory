var path = require('path');
var fs = require('fs');
var async = require('async');
var tito = require('tito');
var yaml = require('js-yaml');

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
  return createDataObject(dir, callback);
};

function createDataObject(dir, done) {
  var data = {};
  async.waterfall([
    function readdir(next) {
      fs.readdir(dir, next);
    },
    function qualifyFilenames(files, next) {
      next(null, files.sort(ascending)
        .map(function(filename) {
          return path.join(dir, filename);
        }));
    },
    function readFiles(filenames, next) {
      async.mapSeries(filenames, function(filename, next) {
        var name = path.basename(filename)
          .replace(/\.[^\.]+$/, '');
        read(filename, function(error, _data) {
          if (error) return next(error);
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
      return createDataObject(filename, done);
    } else {
      // otherwise, ascertain its format using its filename extension
      var format = filename.split('.').pop();
      if (format !== filename) {
        switch (format) {
          // JSON files can just be require()'d
          case 'json':
            return fs.readFile(filename, 'utf8', function(error, buffer) {
              if (error) return done(error);
              return done(null, JSON.parse(buffer.toString()));
            });

          // YAML files are parsed as buffers
          case 'yml':
          case 'yaml':
            return fs.readFile(filename, 'utf8', function(error, buffer) {
              if (error) return done(error);
              return done(null, yaml.safeLoad(buffer));
            });

          case 'csv':
          case 'tsv':
            var data = [];
            var parse = tito.createReadStream(format);
            return fs.createReadStream(filename)
              .pipe(parse)
              .on('error', done)
              .on('data', function(d) { data.push(d); })
              .on('end', function() { done(null, data); });
        }
      }

      // 
      return done();
    }
  });
}

function ascending(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
}