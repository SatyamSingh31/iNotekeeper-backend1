//api yha bnayenge
const express = require('express')
const User = require('../models/User')
const router=express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var fetchuser = require('../middleware/fetchuser');
//we require middleware , when a route needs login required

const JWT_SECRET ='Satyamisahandsomeb$Oy'





/* ROUTE1:here we will create a new user using: POST "/api/auth/createuser"..kind of we are signing up here as an new user
No login required
*/
//yha hmlog express validator package ka use kiye h validation k liye

router.post('/createuser',[
    body('email','Enter a valid email').isEmail(), 
    body('name','Enter a valid name').isLength({ min: 3 }), 
    body('password','Paasword should contains atleast 4 characters').isLength({ min: 4 }),

],async (req,res)=>{
  let success=false
  //if there are errors ,return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    //check whether the user with this email exist already
    try{

    let user = await User.findOne({email:req.body.email})
    if(user){
      return res.status(400).json({success,error:"Sorry a user with this email already exist  s"})
    }
    //yha bcrypt package ka use krke password ko protect kiye h hacker sbse using hash and salt
    const salt=  await bcrypt.genSalt(10)
    const secpassword =  await bcrypt.hash(req.body.password,salt)
    user= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpassword,
      })
      //yha token bheje using jsonwebtokeniser
      const data ={
        user:{
          id : user.id
        }
      }
      const authtoken =jwt.sign(data,JWT_SECRET)
      success=true
      res.json({success,authtoken})
    
     // res.json(user)
   
    }catch(error){
      console.error(error.message)
      res.status(500).send("Some error occured")
    }
  })
   
    //ROUTE2: here we will log in a user or we can say authenticate a user using: POST "/api/auth/login"
    //no login required
   
    router.post('/login',[
    body('email','Enter a valid email').isEmail(), 
    
    body('password','Paasword should not be empty').exists(), 
  ],async (req,res)=>{
    let success=false
    
    //if there are errors ,return bad request and error
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const{email,password} = req.body //here we are using destructuring ,email aur password ko req.body se bahar nikal rhe h
try {
  let user = await User.findOne({email})
  
  //yha user ko pull kr rhe h database mai se ..jiska v email incoming email k barabar hoga
  
  if(!user){
    success=false
    return res.status(400).json({success,error:"Please enter a valid credential"})
  }
  //now will compare the incoming password of an user using bcrypt.compare

  const passwordcompare =  await bcrypt.compare(password,user.password)

  //yha jo password h wo jo user login kr rha h uss wqt jo likh rha h wo h.aur isko match krnge hm line 72 wale user k password se
  
  if(!passwordcompare){
    success=false
    return res.status(400).json({ success,error:"Please enter a valid credential"})
 }
       

 const data ={
  user:{
    id : user.id
  }
}
const authtoken =jwt.sign(data,JWT_SECRET)
success=true
res.json({ success,authtoken})

  
} catch (error) {
  console.error(error.message)
  res.status(500).send("Some error occured") 
  
}



  })
  
  //ROUTE 3: get logged in User details using :POST "/api/auth/getuser". LOGIN REQUIRED

  //hmko yha pr JWT token bhejna prega

  router.post('/getuser', fetchuser, async (req,res)=>{
    try {
      // console.log(req.user);
     const userId=req.user.id
      const user= await User.findById(userId).select("-password")
      res.send(user)


      
    } catch (error) {
      console.error(error.message)
  res.status(500).send("Some error occured")
      
    }
  })


module.exports = router 