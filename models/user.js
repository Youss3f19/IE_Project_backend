const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema( 
    {
        name:{
            type:String
        },
        lastname:{
            type:String
        },
        email:{
            type:String,
            unique : true
        },
        password:{
            type:String
        },
        role:{
            type:String
        },
  

    }, { timestamps: true });
const User = mongoose.model('User', UserSchema);
module.exports = User ;