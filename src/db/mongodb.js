const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-test',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
})
    .then( () => { console.log('Connected successfully..!!' )})
    .catch( (err)=>{ console.log('Error: '+err )})


//delete using promise

// Task.deleteOne({description:"Call dad"})
//     .then( (result)=> {console.log(result)} )
//     .catch( (err)=> {console.log(err)} )


    //updateMany using Promise
// Task.updateMany({completed:false},{
//     $set:{
//         completed:true
//     }
// }).then( (result)=> {
//     console.log(result);
// }).catch( (err)=> {
//     console.log(err);
// })


//Promise Example
// const updateUser = User.findByIdAndUpdate({ _id: '605206f002ba1b2efa01a5cc'},{
//     $set:{
//         name:'Rushikesh'
//     }
// })
// updateUser.then( (user)=>{ console.log(user)} )
//     .catch( (err)=>{ console.log(err)} )


// Task.find({completed:'false'},(err,users)=> {
//     if(err) return console.log(err);
//     console.log(users)
// })
    

    // User.collection.findOne({name:'Mahesh'},(error,result)=> {
//     if(error) return console.log('Error: ',error)

//     console.log(result);
// })



// for 1 record to insert
// let user = new User ({
//         name:'Bhajji',
//         email:'bhajji@gmail.com',
//         age:22,
//         password:'password'
//     })

// user.save()
//     .then( () => console.log('Inserted Successfully..!!'))
//     .catch( (err) =>  console.log('Error: '+ err.message) ) 




//For many records to insert

// let tasks = [
//     {
//         description:'wash the bike',
//     },
//     {
//         description:'Charge the mobile',
//         completed:true
//     },
//     {
//         description:'Call dad',
//         completed:false
//     }
// ]


// Task.insertMany(tasks)
//     .then( () => console.log('Inserted Successfully..!!'))
//     .catch( (err) =>  console.log('Error: '+ err.message) ) 
