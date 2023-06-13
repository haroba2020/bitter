const Item = require("../models/Items");
const User = require("../models/Users");
const Comment = require("../models/Comments");
const jwt = require('jsonwebtoken')


function errorHandler(error){
    console.log('i am now loggin a error lmao')
    if(error.code===11000){
        return 'name allready taken'
    }
    switch (error.message) {
        case 'user validation failed: password: Password must be at least 6 characters':
            return 'Password must be at least 6 characters'
        case "user validation failed: name: username can't be more than 20 letters":
            return "username can't be more than 20 letters"
        case "user validation failed: name: Name should not contain spaces and must be unique":
            return "Name should not contain spaces and must be unique"
        default:
        break;
    }
}

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
const getUserById = async (token) =>{
    const id = await verifyToken(token)
    return new Promise((resolve, reject) => {
        User.findById(id).then((result)=>{
            resolve(result)
        })
    });
}
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
module.exports.user = async (req,res)=>{
    const id = req.params.id;

    // Exclude favicon request
    if (id === 'favicon.ico') {
      return res.status(404).end();
    }
  
    console.log(id);
  
    User.find({name:id}).then((users)=>{
        const user = users[0]
        Item.find({owner:user.name}).then((items)=>{
            res.render('user', {items, owner:user});
        })
    }).catch((err)=>{
        res.render('404')
    })
}

module.exports.home = async (req, res)=>{
    const token = req.cookies.jwt
    const user = await getUserById(token)

    Item.find({owner:user.name}).sort({createdAt:-1}).then((items)=>{
        res.render('home', {items})
    })
}

module.exports.addItem = async (req,res)=>{
    const {title, content} = req.body
    const token = req.cookies.jwt

    const user = await getUserById(token)
    const item = await Item.create({title,content, owner:user.name})
    console.log(item)

    res.status(201).json({item})
}
module.exports.comment = async (req,res)=>{
    const {content,id} = req.body
    const token = req.cookies.jwt

    const user = await getUserById(token)
    const item = await Item.findById(id)
    console.log(item)
    const comment = await Comment.create({content, item:item._id, owner:user.name})
    console.log(comment)

    res.status(201).json({comment})
}
module.exports.addUser = async (req,res)=>{
    const {name, password1, password2} = req.body
    if(password1===password2){
      try {
        console.log(name)
        const user = await User.create({name, password:password1})
        const token = createToken(user._id)
        res.cookie('jwt',token, {maxAge: maxAge * 1000})
        res.status(201).json({user})  
        } catch (error) {
            const err = (errorHandler(error)) 
            res.status(400).json({ err })
        }  
    }else{
        res.status(400).json({ err:"passwords don't match" })
    }
    
}

const maxAge = 3* 24 * 60 * 60 

module.exports.login_post = async (req,res)=>{
    const {name, password} = req.body
    try {
        const user = await User.login(name,password)
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

module.exports.item_delete = (req, res) =>{
    const id = req.params.id

    Item.findByIdAndDelete(id)
    .then(result=>{
        res.json({ redirect: '/' });
    })
    .catch(err=>{
        console.log(err)
    })
}
module.exports.browse = (req,res)=>{
    const id = req.params.id
    Item.findById(id).then((result)=>{
        const item = result
        Comment.find({item:item._id}).sort({createdAt:-1}).then((comments)=>{
            console.log(comments)
            res.render('browse', {item,comments})
        })
    })

    .catch((err)=>{
        console.log(err)
        res.render('404')
    })
}

