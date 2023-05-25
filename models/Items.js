const mongoose = require('mongoose')
const Schema = mongoose.Schema
//enkel schema for å lage blogs
const itemSchema = new Schema({
    thing: {
        type:String,
        required:true
    },
    bing: {
        type:String,
        required:true
    },
    chilling:{
        type:String,
        required:true
    },
    owner:{
        type:String,
        required:true
    },  
});

const Item = mongoose.model('item', itemSchema);
module.exports = Item