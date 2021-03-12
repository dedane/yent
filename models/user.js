  
const express = require('express');
const app = express();
//We use Morgan
const morgan =require('morgan');
const bodyparser =require('body-parser');
const multer = require('multer');
const mongoose =require('mongoose');

mongoose.connect("mongodb+srv://shop-owner_1:1EWXbaHq8KjmX941@shopping-1-ccw4o.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads' ,express.static('uploads'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use((res, req, next) =>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-control-Allow-Headers,Origin, X-requested-with, Content-Type, Accept, Authorization'
    );
    if (req.method === "OPTIONS"){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});





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