const express = require('express');
const Task = require('../model/task');
const User = require('../model/user');

const router = new express.Router();

router.get('/getUsers',async(req,res)=>{
    try{
        const   users = await Task.find().select("user")
        res.json({users })
    }catch(e){
        res.send(e)
    }

})

router.get('/tasks',async(req,res)=> {

    if(req.query.status === undefined){
    
        try{
            const tasks = await Task.find().sort({ createdAt:req.query.createdAt })
            res.json(tasks)
        }catch(e){
            res.status(500).json(e)
        }
    }
    else{
        try{
            const tasks = await Task.find({
                status:req.query.status
            }).sort({ createdAt:req.query.createdAt })
            res.json(tasks)
        }catch(e){
            res.status(501).json(e)
        }
    }
})

router.get('/task/:task',async(req,res)=>{

    // const task = /${req.params.task}/
    
    try{
        // const temp = JSON.parse(task)
        // console.log(typeof(temp))
        const tasks = await Task.find({"taskName":{'$regex': req.params.task}})
        res.json(
            tasks
        )
    }catch(e){
        res.json(e)
    }
})

router.get('/gettasks/:date',async(req,res)=>{

    console.log(req.params.date)
    try{
        const tasks = await Task.find({"dueDate":{'$regex': req.params.date}})
        res.json(
            tasks
        )
    }catch(e){
        res.json(e)
    }
})

router.get('/tasks/:id',async(req,res)=> {

    try{
        const task = await Task.findById(req.params.id)
        res.json(task)
    }catch(e){
        res.status(500).json()
    }    
})

router.post('/tasks',async(req,res) => {
    console.log(req.body)
    try{
        let task = new Task({   
            ...req.body,
        });
        await task.save()
        // console.log(task)
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e)
    }
})

router.put('/tasks/:id',async(req,res)=>{
    try{
        const task = await Task.findByIdAndUpdate(req.params.id,req.body,{ new:true,runValidators:true})

        if(!task){
            return res.status(404).send('No task found..!!')
        }
        res.send(task); 

    }catch(e){
        res.status(400).send();
    }
})


router.put('/tasks/:id',async(req,res)=>{

    const updates = Object.keys(req.body);
    const data = ['taskName','status','dueDate'];

    const isValid = updates.every( (update) => data.includes(update) )
    if(!isValid) return res.status(400).json({'error':'Invalid updates'})

    try{
        // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{ new:true,runValidators:true})
        const task = await Task.findOne({ user:{
            name:req.params.id
        }
        })
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

router.delete('/tasks/:id',async(req,res)=>{
    try{

        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ 
            _id:req.params.id,
            // user:{
            //     name: req.body.name 
            // }
        })
        if(!task){
            return res.status(404).send('Not Found')
        }
        res.send(task);
    }catch(e){
        res.status(500).send()
    }
})

module.exports = router