const express = require('express');
const router=express.Router();
const auth = require('../../middleware/auth')
const User=require('../../models/Users');
const bcrypt=require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt=require('jsonwebtoken');
const config = require('config');


router.get('/',auth,async(req,res)=>{
    
    try{
        const user= await User.findById(req.user.id).select('-password');
        res.json(user);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');

    }
   });


router.post('/',
//conditions
[
//check('name','Name is required')
//.not()
//.isEmpty(),
check('email','email is not in proper format').isEmail()
.isEmail(),
check('password','password is required').exists()
],
//actual body
    async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email,password} = req.body;

    try{
        let user=await User.findOne({email});

        if(!user){
        return res.status(400)
        .json({errors: [{msg: 'Invalid credentials'}]});
        }

        const isMatch= await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400)
            .json({errors: [{msg: 'Invalid credentials'}]});
        }
    
        
        const payload = {
            user : {
                id : user.id
            }
        }

        jwt.sign(payload,
            config.get('jwtSecret'),
            {expiresIn: 360000 },
            (err,token) => {
                if(err) throw err;
                res.json({token});
            } );

    }catch(err){
        console.log(err.message);
        req.status(500).send('Server Error');

    }

    //console.log(req.body);
    
});


module.exports =router;