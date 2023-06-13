const mongoose = require('mongoose')
const Schema = mongoose.Schema
//enkel schema for å lage blogs
const commentSchema = new Schema({
    content: {
        type:String,
        required:true
    },
    item:{
        type:String,
        required:true
    },
    owner:{
        type:String,
        required:true
    }, 
}, {timestamps: true });

const Comment = mongoose.model('comment', commentSchema);
module.exports = Comment