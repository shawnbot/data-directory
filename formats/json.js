var fs = require('fs');

module.exports = function(filename, format, done) {
  return fs.readFile(filename, 'utf8', function(error, buffer) {
    if (error) return done(error);
    return done(null, JSON.parse(buffer.toString()));
  });
};

module.exports.sync = function(filename, format) {
  var buffer = fs.readFileSync(filename, 'utf8');
  return JSON.parse(buffer.toString());
};

