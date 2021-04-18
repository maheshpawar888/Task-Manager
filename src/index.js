const express = require('express');
const bodyParser = require('body-parser')
require('./db/mongodb');
const userRouter = require('../src/router/user');
const taskRouter = require('../src/router/task');


const port = process.env.port || 3000;
const app = express();

//Middleware function
// app.use((req,res,next)=>{
//     if(req.method){
//         res.status(503).send('Site is under construction')
//     }
// })

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port,() => {
    console.log('listening to port',port);
})
