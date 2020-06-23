const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Model = mongoose.model;

const LeadSchema = new Schema({
    name: {type: String},
    email: {type: String},
    status: {type: String}
})

module.exports = Model("Lead", LeadSchema)
