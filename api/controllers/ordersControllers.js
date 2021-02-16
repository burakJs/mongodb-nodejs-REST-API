const mongoose = require('mongoose');
const order = require('../models/order');

const Order = require('../models/order')
const Product = require('../models/product')

const host = 'http://localhost:3000/orders/';

exports.orders_get_all = (req,res,next)=>{
    Order.find()
        .select('_id product quantity')
        .populate('product','name price productImage')
        .then(docs => {
            res.status(200).json({
                count:docs.length,
                orders:docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: host + doc._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({error:err})
        })
}

exports.orders_create_order = (req,res,next)=>{
    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            return res.status(404).json({
                message:'Product not found'
            })
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            product:req.body.productId
        })
    return order.save()
    })
    .then(doc=>{
        res.status(201).json({
            message:'Order stored',
            createdOrder:{
                _id:doc._id,
                product:doc.product,
                quantity: doc.quantity
            },
            request: {
                type:'POST',
                url: host + doc._id
            }
        })
    })
    .catch(err=>{
        res.status(500).json({error: err})
    }) 
}

exports.orders_get_order = (req,res,next)=>{
    Order.findById(req.params.orderId)
        .select('_id product quantity')
        .populate('product','name price productImage')
        .then(order => {
            if(!order){
                return res.status(404).json({
                    message:'Order not found'
                })
            }
            res.status(200).json({
                order:order,
                request:{
                    type: 'GET',
                    url: host
                }
            })
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            })
        })
}

exports.orders_delete_order = (req,res,next)=>{
    Order.findById(req.params.orderId)
        .then(doc => {
            if(!doc){
                return res.status(404).json({
                    message:'Order already deleted',
                })
            }
            return Order.remove({_id:req.params.orderId})  
        })
        .then(doc => {
            res.status(200).json({
                message:'Order deleted',
                request:{
                    type:'POST',
                    url:host,
                    body:{
                        productId:'ID',
                        quantity:'Number'
                    }
                }
            })
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            })
        }) 
}

exports.orders_delete_all = (req,res,next)=>{
    Order.remove()
        .then(doc=>{
            res.status(200).json({
                message:'All products has been removed'
            })
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            })
        })
}