const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        lowercase:true,
        unique:true,
        trim:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email given');
            }
        }
    },
    age:{
        type:Number,
        default:0,
        required:true,
        validate(value){
            if(value < 0){
                throw new Error('age must be positive');
            }
        }
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password must not be password');
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avtar:{
        type:Buffer
    }
},{
    timestamps:true
})


userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.tokens

    return userObject

}

userSchema.methods.generateAuthToken = async function(){
    const user = this;

    const token = jwt.sign({_id:user._id.toString()},'taskmanagerkey')
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token; 
}

userSchema.statics.findByCredentials = async({email,password})=>{
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password,user.password);
    
    if(!isMatch){
        throw new Error('Unable to login');
    }
    return user;
}

//Hash the plain text password before saving
userSchema.pre('save',async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)  //here 8 is no.of rounds
        // console.log(user.password)
    }
    next();
})

//delete users tasks before user remove itself
userSchema.pre('remove',async function(next){
    const user = this;

    await Task.deleteMany({owner:user._id})
    next()
})


const User = mongoose.model('Users',userSchema);

module.exports = User;
