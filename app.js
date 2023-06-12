const express = require('express');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const routes = require('./router/router')
const {checkUser,} = require('./middleware/authmiddleware');
const app = express();

const Item = require("./models/Items");

//middleware
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

app.set('view engine', 'ejs')

//connect til databasen og koble seg til
const dbURI = 'mongodb+srv://haroba:magnin@cluster0.bvxfvdp.mongodb.net/bitter?retryWrites=true&w=majority'
mongoose.set('strictQuery', false);
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => app.listen(3000))
.catch((err)=> console.log(err))

app.get('*', checkUser)

app.get('/',(req,res)=>{
    Item.find().then((items)=>{
            res.render('index', {items})
    })
})


app.use(routes);
