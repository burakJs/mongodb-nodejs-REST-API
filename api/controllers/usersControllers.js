const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.users_create_user = (req,res,next) => {
    User.find({email:req.body.email})
        .then(data => {
            if(data.length > 0){
                return res.status(409).json({
                    message:'Email exists'
                })
            }else{
                bcrypt.hash(req.body.password, 10, (err,hash)=>{
                    if(err){
                        return res.status(500).json({
                            error:err
                        })
                    }else{
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(doc => {
                                res.status(200).json({
                                    message:'User created',
                                    userInfo:doc
                                })
                            })
                            .catch(err=>{
                                res.status(500).json({
                                    error:err
                                })
                            })
                    }
                })
               
            }
        })
}

exports.users_login_user = (req,res,next)=>{
    User.find({email:req.body.email})
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }bcrypt.compare(req.body.password, user[0].password,(err,result)=> {
                if(err){
                    return result.status(401).json({
                        message: 'Auth failed'
                    })
                }
                if(result){
                    const token = jwt.sign({
                        email:user[0].email,
                        userId: user[0]._id
                    },process.env.JWT_KEY,
                    {
                        expiresIn:'1h'
                    })
                    return res.status(200).json({
                        message:'Auth successful',
                        token:token,
                        id:user[0]._id
                    })
                }
                res.status(401).json({
                    message: 'Auth failed'
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                error:err
            })
        })
}

exports.users_delete_user = (req,res,next)=> {
    User.remove({_id:req.params.userId})
        .then(doc => {
            res.status(200).json({
                message:'User has deleted'
            })
        })
        .catch(err => { 
            res.status(500).json({
                error:err
            })
        })
}