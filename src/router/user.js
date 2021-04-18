const express = require('express');
const User = require('../model/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

const router = new express.Router();

router.get('/users/me',auth,async(req,res)=> {
    res.send(req.user);
})

router.post('/users',async(req,res) => {
   let user = new User(req.body);
   try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
   }
})

router.put('/users/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body);
    const data = ['name','email','password','age'];
    const isValid = updates.every( (update)=> data.includes(update) )

    if(!isValid) {
        return res.status(400).send({ 'error':'Invalid updates' })
    }

    try{
        const user = req.user

        updates.forEach( (update)=> user[update] = req.body[update])
        await user.save();
        res.send(user);
    }catch(e){
        res.status(404).send();
    }

})

router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body);
        const token = await user.generateAuthToken();
        res.send({ user,token });
    }catch(e){
        res.status(400).send('Invalid Credentials');
    }
})

router.post('/users/logout',auth,async(req,res)=> {
    try{
        req.user.tokens = req.user.tokens.filter( (token)=>{
            return token.token !== req.token
        })
        await req.user.save();
        res.send()
    }
    catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutall',auth,async(req,res)=> {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send(e);
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    try{
        await req.user.remove();
        res.send(req.user);
    }catch(e){
        res.status(500).send()
    }
})

//save files using multer       
const avtar = multer({
    limits:{
        fieldSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image...!!'))
        }
        cb(undefined,true)
    }
})


router.post('/upload',auth,avtar.single('upload'),async(req,res)=> {
    //convert an image to png using sharp
    const buffer = await sharp(req.file.buffer).resize({ width: 250 , height:250}).png().toBuffer();
    
    req.user.avtar = buffer;
    await req.user.save()
    res.send();
},(error,req,res,next) =>{
    res.status(400).send({ Error: error.message })
})

router.delete('/users/me/avtar',auth,async(req,res)=> {
    try{
        req.user.avtar = undefined
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/:id/avtar',async(req,res)=> {
    try{
        const user = await User.findById(req.params.id);

        if(!user || !user.avtar){
            throw new Error();       
        }

        res.set('Content-Type','image/png');
        res.send(user.avtar);

    }catch(e){
        res.status(404).send()
    }

})

module.exports = router