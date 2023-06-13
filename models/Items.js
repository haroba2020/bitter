const mongoose = require('mongoose')
const Schema = mongoose.Schema
//enkel schema for å lage blogs
const itemSchema = new Schema({
    title: {
        type:String,
        required:true
    },
    content: {
        type:String,
        required:true
    },
    owner:{
        type:String,
        required:true
    },  
}, {timestamps: true });

const Item = mongoose.model('item', itemSchema);
module.exports = Item