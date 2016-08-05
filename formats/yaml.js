var fs = require('fs');
var jsyaml = require('js-yaml');

module.exports = function yaml(filename, format, done) {
  return fs.readFile(filename, 'utf8', function(error, buffer) {
    if (error) return done(error);
    return done(null, jsyaml.safeLoad(buffer));
  });
};
