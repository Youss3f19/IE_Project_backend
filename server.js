const express = require('express');
const userApi = require('./routes/users');
const examApi = require('./routes/exams');

const cors = require('cors')
require('./config/connect');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/user' , userApi);
app.use('/exam', examApi);




app.listen( 3001 , ()=>{console.log('server work !');
})