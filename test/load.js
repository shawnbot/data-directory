#!/usr/bin/env node
var path = require('path');
var load = require('../');

var dir = process.argv.length > 2
  ? process.argv[2]
  : path.join(process.cwd(), '_data');

load(dir, function(error, data) {
  if (error) return console.error('ERROR:', error);
  console.log(JSON.stringify(data, null, '  '));
});
