const jwt = require('jsonwebtoken')
const User = require('../model/user');


const auth = async(req,res,next)=> {
    // console.log('Auth')
    
    try{
        const token = req.header('token');
        // console.log(token)
        const decoded = jwt.verify(token,'taskmanagerkey')
        const user = await User.findOne({_id:decoded._id,'tokens.token':token })
        // console.log(user)


        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send('Please Authenticate')
    }

}

module.exports = auth