var fs = require('fs');
var tito = require('tito');

module.exports = function tabular(filename, format, done) {
  var data = [];
  var parse = tito.createReadStream(format);
  return fs.createReadStream(filename)
    .pipe(parse)
    .on('error', done)
    .on('data', function(d) { data.push(d); })
    .on('end', function() { done(null, data); });
};
