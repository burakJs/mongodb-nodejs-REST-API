const mongoose = require('mongoose')
const Product = require('../models/product')

const host = 'http://localhost:3000/products/';

exports.products_get_all = (req,res,next)=>{
    Product.find()
        .select('_id name price productImage')
        .then(docs=>{
            const response = {
                count:docs.length,
                products: docs.map(doc =>{
                    return{
                        _id: doc._id,
                        name:doc.name,
                        price:doc.price,
                        productImage:doc.productImage,
                        request:{
                            type: 'GET',
                            url: host + doc._id
                        }
                    }
                })
            }
            res.status(201).json(response);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error:err})
        });
}

exports.products_create_product = (req,res,next)=>{
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: 'http://localhost:3000/'+ req.file.path
    });
    product.save()
        .then((docs)=>{
            console.log(docs);
            res.status(200).json({
                message:'Created product successfully',
                createdProduct:{
                    _id: docs._id,
                    name: docs.name,
                    price:docs.price,
                    productImage:docs.productImage,
                    request:{
                        type: 'POST',
                        url: host+docs._id
                    }
                }
            })
        }).catch((err)=>{
            console.log(err);
            res.status(500).json({error:err})
        });

   
}

exports.products_get_product = (req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id)
        .select('_id name price productImage')
        .then(docs =>{
            console.log(docs);
            if(docs){
                res.status(200).json({
                    product:docs,
                    request:{
                        type:'GET',
                        url:host + docs._id
                    }
                });
            }
            else{
                res.status(404).json({message:'Not found'})
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({err:err});
        })
}

exports.products_edit_product = (req,res,next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id:id},{$set: updateOps})
        .then(docs => {
            res.status(200).json({
                message:'Product updated',
                request:{
                    type:'PATCH',
                    url: host + docs.id
                }
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error:err});
        })
}

exports.products_delete_product = (req,res,next)=>{
    const id = req.params.productId;

    Product.findById(id)
        .then(doc=>{
            if(!doc){
                return res.status(404).json({
                    message:'Product already deleted',
                })
            }
            return Product.remove({_id:id})
        })
        .then(docs=>{
            res.status(200).json({
                message: 'Product deleted',
                request:{
                    type: 'POST',
                    url:host,
                    body:{
                        name:'String',
                        price:'Number'
                    }
                }
            });
        })
        .catch(err=>{
            
            console.log(err);
            res.status(500).json({error:err});
            throw err;
        })
}