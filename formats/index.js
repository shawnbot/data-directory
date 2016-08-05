var yaml = require('./yaml');
var tabular = require('./tabular');

// exports by filename extension
module.exports = {
  json: require('./json'),
  yml: yaml,
  yaml: yaml,
  csv: tabular,
  tsv: tabular
};
