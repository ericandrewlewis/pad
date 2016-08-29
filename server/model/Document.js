'use strict'

const mongoose = require('mongoose')

let documentSchema = new mongoose.Schema({
  version: Number,
  content: Object,
  steps: Object
})

let model = mongoose.model('Document', documentSchema)
module.exports = model
