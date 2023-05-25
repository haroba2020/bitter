const Item = require("../models/Items");
const User = require("../models/Users");
const jwt = require('jsonwebtoken')

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, 'hrobos secret', (err, decodedToken) => {
        if (err) {
          // handle error
          reject(err);
        } else {
          resolve(decodedToken.id);
        }
      });
    });
  };
  //en jwt cookie som tar in user id som lagres for senere bruk
const createToken = (id) => {
    return jwt.sign({ id }, 'hrobos secret', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req,res)=>{
    res.render('signup');
}

module.exports.login_get = (req,res)=>{
    res.render('login');
}
module.exports.additem_get = (req,res)=>{
    res.render('additem');
}


module.exports.addItem = async (req,res)=>{
    const {thing,bing,chilling} = req.body
    const token = req.cookies.jwt

    const id = await verifyToken(token)
    const user = await User.findById(id)
    const item = await Item.create({thing,bing,chilling, owner:user.email})
    console.log(item)

    res.status(201).json({item})
}

module.exports.addUser = async (req,res)=>{
    const {name, password, email} = req.body
    const user = await User.create({name, password, email,})
    const token = createToken(user._id)
    res.cookie('jwt',token, {maxAge: maxAge * 1000})
    res.status(201).json({user})
}
const maxAge = 3* 24 * 60 * 60 

module.exports.login_post = async (req,res)=>{
    const {email, password} = req.body
    try {
        const user = await User.login(email,password)
        const token = createToken(user._id)

        res.cookie('jwt',token, {httpOnly:true, maxAge: maxAge * 1000})
        res.status(200).json({user: user._id})
    }

    catch(err){
        res.status(400).json({ err })
    }
}
module.exports.logout = async (req,res) =>{
    res.cookie('jwt', '',{maxAge: 1 })
    res.redirect('/')
}

module.exports.Item_delete = (req, res) =>{
    const id = req.params.id

    Item.findByIdAndDelete(id)
    .then(result=>{
        res.json({ redirect: '/' });
    })
    .catch(err=>{
        console.log(err)
    })
}

