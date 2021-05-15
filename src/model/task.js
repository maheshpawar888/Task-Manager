const mongoose = require('mongoose');
const User = require('./user');

const taskSchema = new mongoose.Schema({
    taskName:{
        type:String,
        trim:true,
        required:true
    },
    status:{
        type:String,
        default:'Pending'
    },
    dueDate:{
        type:Date,
        // required:true
    },
    user:{
        type:{ User },
        required:true,      
    }
})

const Task = mongoose.model('Task',taskSchema);

module.exports = Task;