'use strict'

let express = require('express')
let mustacheExpress = require('mustache-express');

let app = express()

let PORT = 3000

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/src');

app.use('/css', express.static('public/css'))
app.use('/js', express.static('public/js'))

app.get('/', (req, res) => {
    let scriptUrl = 'http://localhost:3333/public/js/index.js'
    res.render('index', {scriptUrl: scriptUrl})
})

app.listen(PORT)
