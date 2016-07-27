'use strict'

let fs = require('fs')
let Mustache = require('mustache')

fs.readFile( __dirname + '/src/index.mustache', 'utf8', (err, contents) => {
  contents = Mustache.render(contents, {scriptUrl: 'js\/index.js'})
  fs.writeFile( __dirname + '/public/index.html', contents, (err) => {
    if (err) throw err;
    process.stdout.write("Created public/index.html\n");
  });
});