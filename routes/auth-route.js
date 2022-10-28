const router = require('express').Router();
const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const todo = require('../models/todo');
const SECRET_KEY = "TODOAPP";

router.post('/register',(req, res)=>{
    bcrypt.hash(req.body.password, 10, (err, hash)=>{
        if(err){
            return res.json({ success: false, message: "Hash error"})
        } else {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            })

            user.save().then((_)=>{
                res.json({ success: true, message:"Account has been created"});
            })
            .catch((err)=>{
                if(err.code === 11000){
                    return res.json({success: false, message: "Email is already Exist"})
                }
                res.json({success:false, message:"Authentication failed"})
            })
        }
    })
});

router.post('/login',(req, res)=>{
    User.find({email: req.body.email}).exec().then((result) => {
        if(result.length < 1){
            return res.json({success: false, message: "user not found"})
        }
        const user = result[0]
        bcrypt.compare(req.body.password, user.password, (err, ret)=>{
            if(ret){
                const payload = {
                    userId: user._id,
                }
                const token = jwt.sign(payload, SECRET_KEY)
                return res.json({success: true, token: token, message: "Login Successfull"})
            } else {
                return res.json({success: false, message: "Login failed"})
            }
        })
    }).catch(err => {
        res.json({success: false, message: "Authentication failed"})
    })
});

router.post('/add', (req, res, next) => {
    const taskdata = {
      title: req.body.title,
      task: req.body.task
    }
    let data = todo(taskdata); 
    data.save((err) => {
      if (err) {   
       res.json({success: false, message: 'Task not added'});
      } else {      
       res.json({success: true, message: 'Task added successfully'});
      }
    })
  });

  router.get('/display', (req, res) => {
    todo.find((err, todo) => {
      if (err) {
        console.log(err);
      } else {
        res.send(todo);
      }
  }); 
  });

  router.delete('/task/:id', (req, res) => {
    todo.findByIdAndDelete(req.params.id).then((task) => {
        if (!task) {
            return res.status(404).send();
        }
        res.send("task deleted successfully");
    }).catch((error) => {
        res.status(500).send(error);
    })
})


  router.get('/edit/:id', (req, res) => {
    console.log(req.params.id);
    todo.findById(req.params.id, (err, todo) => {
      if (err) {
        console.log(err);
      } else {
        res.send(todo);
      }
    });
  });

  router.put('/edit/:id', (req, res) => {
    todo.findByIdAndUpdate(req.params.id, req.body, (err) => {
      if(err){
        res.json({success: false, message:"something went wrong"} +req.params.id);
    } else {
      res.json({success: true, message: "Task edited successfully"});
    }
    });
  });

  router.get('/search',(req,res)=>{   
    todo.find({ 
      $or: [
        { title: { $regex: req.query.search } }, 
        { task: { $regex: req.query.search } }] }, (err, todo) => {  
  if(err){  
  console.log(err);  
  }else{  
  res.send(todo);  
  }  
  })  
  }); 

module.exports = router;