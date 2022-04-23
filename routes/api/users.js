const express = require('express');
const router=express.Router();
const {check, validationResult} = require('express-validator');
const User= require('../../models/Users');
const gravatar = require('gravatar');
const bycrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const config = require('config');


router.post('/',
//conditions
[
check('name','Name is required')
.not()
.isEmpty(),
check('email','email is not in proper format').isEmail()
.isEmail(),
check('password','password should be more than 6 character').isLength({ min : 6})
],
//actual body
    async(req,res)=>{
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({msg: 'bad-just checking'});
    }

    const {name,email,password} = req.body;

    try{
        let user=await User.findOne({email});

        if(user){
        return res.status(400).json({errors: [{msg: 'User already exists'}]});
        }

        const avatar = gravatar.url(email,{
            s: '200',
            r: 'pg',
            d :'mm' 
        });
        user= new User({
            name,
            email,
            avatar,
            password

        });

        const salt = await bycrypt.genSalt(10);

        user.password =  await bycrypt.hash(password, salt);

        await user.save();
        
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