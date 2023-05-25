const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

//enkel schema for å lage blogs
const userSchema = new Schema({
    email: {
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
    
}, {timestamps: true });

userSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.post('save', function(doc, next){
    console.log('new user was created & saved', doc)
    next()
})
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email})
    if(user){
        const auth = await bcrypt.compare(password,user.password)
        if(auth){
            //retunerer brukeren etter alt er bekrefter
            return user
        }
        throw Error ('incorrect password')
    }
    throw Error ('incorrect email')
}

const User = mongoose.model('user', userSchema);
module.exports = User