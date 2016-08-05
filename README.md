# data-directory

This is a Node module for loading structured data from a directory in the style of [Jekyll's `_data`][data files]. Install it with:

```
npm install data-directory
```

## API
The `data-directory` module exports two top-level functions:

1. `load(dirname, callback)` asynchronously loads all of the data in a directory
   and calls the `callback` function with the entire data structure when finished.

  ```js
  var datadir = require('data-directory');
  datadir.load('path/to/data', function(error, data) {
    // your data here
  });
  ```
  
1. `proxy(dirname [, data])` creates a [proxy] object that loads data
   synchronously, and only as needed, from the same directory structure.

  ```js
  var datadir = require('data-directory');
  var data = datadir.proxy('path/to/data');
  // reads path/to/data/foo.{csv,json,tsv,ya?ml}
  // or, if path/to/data/foo is a directory, returns a new proxy
  var foo = data.foo;
  ```
  
  :warning: **In order to use the proxy feature, you'll need to run Node with
  the `--harmony-proxies` flag.**

### Directory Structure
Your directory should contain one or more files with the following extensions:

* `.csv` for comma-separated values
* `.json` for JSON
* `.tsv` for tab-separated values
* `.yaml` or `.yml` for YAML

You can read them all into a single data structure like this:

```js
var datadir = require('data-directory');
datadir.load('_data', function(error, data) {
  if (error) return console.error('error:', error);
  console.log('data:', JSON.stringify(data, null, '  '));
});
```

#### Nested Directories
Nested directories will introduce new levels in the data structure. For instance, if you data directory looks like this:

```
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
[proxy]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
