const express= require('express');
const connectDB = require('./config/db');

const app=express();

connectDB();

const PORT=process.env.PORT || 3000;

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3001', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));


app.use(express.json({extended: false }));
app.get('/',(req,res) => res.send('API running'));

app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/post',require('./routes/api/post'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/users',require('./routes/api/users'));

app.listen(PORT,() => console.log(`server started on port ${PORT}`));

