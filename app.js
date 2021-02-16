const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_ATLAS_PW}@node-rest-shop.z72vq.mongodb.net/node-rest-shop?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
mongoose.set('useCreateIndex', true);

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header(
        'Access-Control-Allow-Headers',
        ' X-Requested-With, Content-Type, Accept, Authorization'    
    )
    if(req.method == 'OPTIONS'){
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        )
        return res.status(200).json({});
    }
    next();
})

//localhost:3000/products/
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);


app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})
module.exports = app;