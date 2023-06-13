const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

//enkel schema for å lage blogs
const userSchema = new Schema({
    name: {
        type:String,
        required:true,
        unique: true,
        maxlength: [20,"username can't be more than 20 letters"],
        validate: {
            validator: function (name) {
                if (/\s/.test(name)) {
                    return false;
                }
                
                // Check if name is unique (case-insensitive)
                return this.constructor.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
                    .then(user => !user); // Returns false if a matching user is found
                
            },
            
            message: "Name should not contain spaces and must be unique",
        }
    },
    password:{
        type:String,
        required:true,
        minlength: [6,'Password must be at least 6 characters'],
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
userSchema.statics.login = async function(name,password){
    const user = await this.findOne({name})
    if(user){
        const auth = await bcrypt.compare(password,user.password)
        if(auth){
            //retunerer brukeren etter alt er bekrefter
            return user
        }
        throw Error ('incorrect password')
    }
    throw Error ('incorrect username')
}

const User = mongoose.model('user', userSchema);
module.exports = User