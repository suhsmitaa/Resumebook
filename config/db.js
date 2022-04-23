const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');


const conectDB = async () => {

    try{
       await mongoose.connect(db);
       console.log('MongoDB connected...');
    }catch(err){
      console.log(err.message);
      process.exit(1);
    }
};

module.exports = conectDB ;