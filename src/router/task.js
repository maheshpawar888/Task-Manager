const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../model/task')
const multer = require('multer');

const router = new express.Router();

router.get('/tasks',auth,async(req,res)=> {

    if(req.query.completed === undefined){
    
        try{
            const tasks = await Task.find({
                owner:req.user._id,
                // completed:req.query.completed
            }).sort({ createdAt:req.query.createdAt })
            res.send(tasks)
        }catch(e){
            res.status(500).send()
        }
    }
    else{
        try{
            const tasks = await Task.find({
                owner:req.user._id,
                completed:req.query.completed
            }).sort({ createdAt:req.query.createdAt })
            res.send(tasks)
        }catch(e){
            res.status(500).send()
        }
    }
})

router.post('/tasks',auth,async(req,res) => {
    let task = new Task({
        ...req.body,
        owner:req.user._id
    });
    try{
        await task.save()
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e)
    }
})


router.put('/tasks/:id',auth,async(req,res)=>{

    const updates = Object.keys(req.body);
    const data = ['description','completed'];

    const isValid = updates.every( (update) => data.includes(update) )
    if(!isValid) return res.status(400).json({'error':'Invalid updates'})

    try{
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{ new:true,runValidators:true})
        const task = await Task.findOne({ _id:req.params.id,owner:req.user._id })
        // const task = await Task.findById(req.params.id);

        if(!task){
            return res.status(404).send('No task found..!!')
        }

        updates.forEach( (update) => task[update] = req.body[update])
        await task.save()       
        res.send(task); 

    }catch(e){
        res.status(400).send();
    }
})



router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOne({ _id:req.params.id,owner:req.user._id })
        if(!task){
            return res.status(404).send()
        }
        await task.remove();
        res.send(task);
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router