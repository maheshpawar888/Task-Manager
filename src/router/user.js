const express = require('express');
const User = require('../model/user');

const router = new express.Router();

router.post('/users',async(req,res) => {
   let user = new User(req.body);
   try{
        await user.save();
        res.status(201).send({user})
    }catch(e){
        res.status(400).send(e)
   }
})

router.get('/users',async(req,res)=>{
    try{
        const users = await User.find()
        if(!users) {
            return res.status(404).json({
                Error:'not found'
            })
        }
        res.json(users)
    }catch(e){
        res.status(404).json({
            e
        })
    }
})

module.exports = router