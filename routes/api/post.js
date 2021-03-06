const { response } = require('express');
const express = require('express');
const router=express.Router();
const {check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const Post=require('../../models/Post');
const Profile=require('../../models/Profile');
const User=require('../../models/Users');
const { route } = require('./auth');



router.post('/',[auth,[
    check('text','text is required').not().isEmpty()
]],async (req,res)=> {
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user : req.body.id
        });
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
        
    }
});

router.get('/',auth,async(req,res)=>{

  try{
      const posts= await Post.find().sort({date: -1});
      res.json(posts);

  }catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');

  }
}
);

router.get('/:id',auth,async(req,res)=>{

    try{
        const post= await Post.findById(req.params.id);

        if(!post){
            return res.status(400).json({msg: 'post not found'});
        }
        res.json(post);
  
    }catch(err) {
          console.error(err.message);
          if(err.kind === 'ObjectId'){
            return res.status(400).json({msg: 'post not found'});
        }
          res.status(500).send('Server Error');
  
    }
  }
  );

  router.delete('/:id',auth,async(req,res)=>{

    try{
        const post= await Post.findById(req.params.id);
       
        if(!post){
            return res.status(400).json({msg: 'post not found'});
        }

       /* if(typeof post.user == "undefined" ||post.user.toString() !== req.user.id){
            console.log(post);
            console.log(req.user.id);
            return res.status(401).json({msg : 'user not authorized'});
        }*/
        await post.remove();
        res.json({msg:"Post removed"});
  
    }catch(err) {
          console.error(err.message);
          if(err.kind === 'ObjectId'){
            return res.status(400).json({msg: 'post not found'});
        }
          res.status(500).send('Server Error');
  
    }
  }
  );

  router.put('/like/:id',auth,async (req,res)=>{
      try {
           const post = await Post.findById(req.params.id);

          if(post.likes.filter(like => like.user.toString()=== req.user.id).length >0){
              return res.status(400).json({msg: 'Post already liked'});

           }
          // console.log("checking error");
          // console.log(user= req.user.id);

           post.likes.unshift({user: req.user.id});

           await post.save();
           res.json(post.likes);
      } catch (error) {
          console.error(error.message);
          res.status(500).send('Server Error');
      }

  });

  router.put('/unlike/:id',auth,async (req,res)=>{
    try {
         const post = await Post.findById(req.params.id);

        if(post.likes.filter(like => like.user.toString()=== req.user.id).length === 0){
            return res.status(400).json({msg: 'Post has not been liked'});

         }
        // console.log("checking error");
        // console.log(user= req.user.id);

        const removeIndex =post.likes.map(like => like.user.toString()).indexOf(req.user.id);

         post.likes.splice(removeIndex,1);

         await post.save();
         res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }

});

router.post('/comment/:id',[auth,[
    check('text','text is required').not().isEmpty()
]],async (req,res)=> {
    const errors  = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user : req.body.id
        };

        post.comments.unshift(newComment);

        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
        
    }
});

router.delete('/comment/:id/:comment_id',auth,async(req,res)=>{

    try {
       

        const post = await Post.findById(req.params.id);

        const comment= post.comments.find(comment => comment.id === req.params.comment_id);

        //console.log(comment._id);
      // console.log(comment._id.toString());
      
      
       
        if(!comment){
            return res.status(404).json({msg:"Comment doesnot exist"});
        }
       
//user checking
    /*    if(comment._id.toString() !== req.user.id){
            return res.status(404).json({msg:"User not authorzed"});
        }
        */
        
        const removeIndex =post.comments.map(comment=> comment._id.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex,1);

        await post.save();
        res.json(post.comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
        
    }
});

module.exports =router;