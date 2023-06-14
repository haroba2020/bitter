const mongoose = require('mongoose')
const Schema = mongoose.Schema
//enkel schema for å lage blogs
const postSchema = new Schema({
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

const Post = mongoose.model('post', postSchema);
module.exports = Post