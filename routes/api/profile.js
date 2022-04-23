const express = require('express');
const request = require('request');
const config = require('config');
const router=express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/Users');
const { check, validationResult } = require('express-validator');
const { route } = require('./auth');
const Post = require('../../models/Post');

router.get('/me',auth,async(req,res)=>{ 
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate(
            'user',
            ['name','avatar']
        );
        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
        }
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.Status(500).send('Server Error');

    }


});

router.post('/',
[
    auth,
    [

    check('status','status cannot be empty')
    .not()
    .isEmpty(),
    check('skills','skills cannot be empty')
    .not()
    .isEmpty()

    ]
],
async(req,res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

const {company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,facebook,
        twitter,
        instagram,
        linkedin
    } =req.body;

    const profileFields={};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website=website;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername=githubusername;
    if(skills) {
        
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }   
//building social array
    profileFields.social = {}
    if(youtube) profileFields.social.youtube=youtube;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(twitter) profileFields.social.twitter=twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(instagram) profileFields.social.instagram = instagram;

    console.log(profileFields.social.twitter);

   try{
       let profile = await Profile.findOne({ user : req.user.id });

        if(profile){

            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set:profileFields},
                {new: true}
                );

                return res.json(profile);
        }

        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
   }catch(err){
    console.log(err.message);
    res.status(500).send('server error');
   }

});

router.get('/',async(req,res)=>{
    try{

        const profiles = await Profile.find().populate('user', ['name','avatar']);
        res.json(profiles);
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/user/:user_id',async(req,res)=>{
    try{

        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name','avatar']);
        if(!profile)
        return res.status(400).json({msg: 'There is no profile for this user'});

        res.json(profile);
    }catch(err){

        if(err.Kind == 'ObjectId')
        return res.status(400).json({msg: 'There is no profile for this user'});

        console.log(err.message);
        res.status(500).send('Server error');
    }
});

router.delete('/',auth,async(req,res)=>{
    try{

        await Post.deleteMany({user : req.user.id});

        await Profile.findOneAndRemove({user : req.user.id});
        await User.findOneAndRemove({_id : req.user.id});
        res.json({msg: 'user deleted'});
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/experience',
[auth,[
    check('title','title is required').not().isEmpty(),
    check('company','compny is required').not().isEmpty(),
    check('from','From date is required').not().isEmpty()

]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const{
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,location,from,to,current,description
    }
    try{
        const profile = await Profile.findOne({ user: req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.delete('/experience/:exp_id',auth,async(req,res)=>{
    try{
        
        const profile = await Profile.findOne({user : req.user.id});

        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();

        res.json(profile);
        
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});



router.put('/education',
[auth,[
    check('school','school is required').not().isEmpty(),
    check('degree','degree is required').not().isEmpty(),
    check('fieldofstudy','fieldofstudy date is required').not().isEmpty()

]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const{
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,fieldofstudy,from,to,current,description
    }
    try{
        const profile = await Profile.findOne({ user: req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.delete('/education/:edu_id',auth,async(req,res)=>{
    try{
        
        const profile = await Profile.findOne({user : req.user.id});

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex,1);
        await profile.save();

        res.json(profile);
        
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/github/:username',(req,res)=>{
    try{
        const options = {
            uri:`https://api.github.com/users/${
                req.params.username
        }/repos?per_page=5&sort=created:asc&client_id=${config.get(
            'githubClientId'
        )}&client_secret=${config.get('githubSecret')}`,
        method: 'GET',
        headers: {'user-agent': 'node.js'}
        };
        request(options,(error,response,body)=>{
            
            if(error) console.error(error);
            if(response.statusCode !== 200){
                res.status(404).json({msg: 'No Github profile found'});
            }
            res.json(JSON.parse(body));
        });

    
}catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});
module.exports =router;