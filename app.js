  
const express = require('express');
const app = express();
//We use Morgan
const morgan =require('morgan');
const bluebird = require('bluebird');
const bodyparser =require('body-parser');
//const multer = require('multer');
const mongoose =require('mongoose');
const cors = require('cors')

const userRoutes = require('./routes/user');
require('dotenv').config();

mongoose.Promise = require('bluebird')

mongoose.connect("mongodb+srv://evans:"+ process.env.MONGO_ATLAS_PW +"@cluster0.cck8r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'))
conn.once('open',() => {
    console.log('connected to a database')
})

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use(cors())



app.use((res, req, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === "OPTIONS"){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname +'/index.html');
})

//Routes that handle request
app.use('/user', userRoutes);


app.use((req, res, next)=>{
    const error = new Error('Not Found');
    error.status=404;
    next(error);
});

app.use((error, req, res, next) =>{
        res.status(error.status || 500);
        res.json({
            error: {
                message: error.message
            }
        });
});

module.exports = app;
