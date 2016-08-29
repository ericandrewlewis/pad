'use strict'

let express = require('express');
let mustacheExpress = require('mustache-express');
let mongoose = require('mongoose');
let Document = require('./model/Document')
// Let mongoose use the native Nodejs Promise implementatoin.
mongoose.Promise = global.Promise

process.env.MONGO_URL = 'mongodb://localhost/app'
mongoose.connect(process.env.MONGO_URL)
let db = mongoose.connection

let PORT = 3000

db.once('open', () => {
  process.stdout.write('Connected to Mongo server\n')
  app.listen(PORT)
  process.stdout.write(`Express running on http://localhost:${PORT}\n`)
})

let app = express();

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');

app.get('/', (req, res) => {
    let scriptUrl = 'http://localhost:3333/public/js/index.js'
    res.render('index', {scriptUrl: scriptUrl})
})

app.get('/docs', function(req, res) {
  Document.find({}).exec()
    .then((documents) => {
      res.json(documents)
    })
    .catch((error) => {
      process.stderr.write(error)
    })
});

app.get('/docs/:id', function(req, res) {
  Document.findOne({
    _id: req.params.id
  }).exec()
    .then((document) => {
      res.json(document)
    })
    .catch((error) => {
      process.stderr.write(error)
    })
});
