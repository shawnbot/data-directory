# data-directory

This is a Node module for loading structured data from a directory in the style of [Jekyll's `_data`][data files].

Your directory should contain one or more files with the following extensions:

* `.csv` for comma-separated values
* `.json` for JSON
* `.yaml` or `.yml` for YAML

You can read them all into a single data structure like this:

```js
var loadData = require('data-directory');
loadData('_data', function(error, data) {
  if (error) return console.error('error:', error);
  console.log('data:', JSON.stringify(data, null, '  '));
});
```

Nested directories will introduce new levels in the data structure. For instance, if you data directory looks like this:

```
_data
├─ bar.json
└─ baz
   └─ qux.csv
```

Then it should parse into a JSON structure that looks like:

```js
{
  "bar": {
    // contents of bar.json
  },
  "baz": {
    "qux": [
      // rows in baz/qux.csv
    ]
  }
}
```

[Jekyll]: https://jekyllrb.com
[data files]: https://jekyllrb.com/docs/datafiles/
