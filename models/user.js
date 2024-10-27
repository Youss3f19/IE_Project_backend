const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema( 
    {
        name:{
            type:String,
            required: true,
        },
        lastname:{
            type:String,
            required: true
        },
        email:{
            type:String,
            required: true,
            unique : true
        },
        password:{
            type:String,
            required: true,
        },
        role:{
            type:String,
            required: true,

        },
        isActive:{
            type:Boolean,
            default: false,
        },
        activationCode: String,
  

    }, { timestamps: true });
const User = mongoose.model('User', UserSchema);
module.exports = User ;