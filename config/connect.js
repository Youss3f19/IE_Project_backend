const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://yousseflaribi2004:youssef19072004@isetexams.smmez.mongodb.net/')
    .then( 
        ()=>{console.log('Connected to MongoDB Atlas');}
    )
    .catch( (err) => console.error('Could not connect to MongoDB Atlas', err));




module.exports = mongoose;