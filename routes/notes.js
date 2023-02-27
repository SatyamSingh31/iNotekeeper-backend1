const express = require('express')
const router=express.Router()
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');

//ROUTE1: get all the notes using: GET "api/notes/fetchallnotes"

router.get('/fetchallnotes', fetchuser,  async (req,res)=>{
    try {
        const notes= await Note.find({user: req.user.id})//yha ahm user ki id pass kr rhe h aur usse saara notes mil jayega
     res.json(notes)
        
    } catch (error) {
        console.error(error.message)
      res.status(500).send("Some error occured")
        
    }
    
})
//ROUTE2: add a new notes using: POST "api/notes/addnote"..login required

router.post('/addnote', fetchuser, [
    body('title','Enter a valid title').isLength({min:3}), 

    body('description','Description should contains atleast 4 characters').isLength({ min: 6}),

], async (req,res)=>{
    try {
        const{title,description,tag } = req.body  //destructuring 

    //if there are errors ,return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Note ({
      title,description,tag, user:req.user.id
    })
    const savedNote= await note.save()
    res.json(savedNote)
        
    } catch (error) {
        console.error(error.message)
      res.status(500).send("Some error occured")
        
    }
   
    
     
})
//ROUTE3: update a existing note using: PUT "api/notes/updatenote"..login required
router.put('/updatenote/:id', fetchuser, async (req,res)=>{

    const{title,description,tag}=req.body

    //now i will create a newnote obj

    const newnote={}
       if(title) {
        newnote.title=title  //agr title aarha h as a part of request tb hm usko iss obj mai add krunga aur agr nhi aarha toh iska mtlb user update nhi krna chahta 
       } 
       if(description) {
        newnote.description=description  //agr description aarha h as a part of request tb hm usko iss obj mai add krunga aur agr nhi aarha toh iska mtlb user update nhi krna chahta 
       }
       if(tag) {
        newnote.tag=tag //agr tag aarha h as a part of request tb hm usko iss obj mai add krunga aur agr nhi aarha toh iska mtlb user update nhi krna chahta 
       }

       //find the note to be updated and update it
       let note =await Note.findById(req.params.id )//maine wo note nikal liya jisko mai update krna chaahta hu
        // console.log(note);
       //ye v hoskta h ki ye note exist nhi krta ho iss id ka tb niche jo code likh rhe wo krnge

       if(!note){ return res.status(404).send( "not found")}
        
       if(note.user.toString()!== req.user.id) { //note.user.toString  hmlog ko note ka id dega
       return res.status(401).send("not allowed") 
    
       }
       note= await Note.findByIdAndUpdate(req.params.id, {$set: newnote} ,{new:true}) //new:true isse note update hojayega
       res.json({note})
    })

       //ROUTE4: delete a existing note using: DELETE "api/notes/deletenote"..login required
router.delete ('/deletenote/:id', fetchuser, async (req,res)=>{

    const{title,description,tag}=req.body

    

       //find the note to be deleted and  delete it
       let note =await Note.findById(req.params.id )//maine wo note nikal liya jisko mai update krna chaahta hu
        // console.log(note);
       //ye v hoskta h ki ye note exist nhi krta ho iss id ka tb niche jo code likh rhe wo krnge

       if(!note){ return res.status(404).send( "not found")}
        
       //allow deletion only if user owns this note

       if(note.user.toString()!== req.user.id) { //note.user.toString  hmlog ko note ka id dega
       return res.status(401).send("not allowed") 
    
       }
       note= await Note.findByIdAndDelete(req.params.id ) 
       res.json({"Success": "note has been deleted"})
})
module.exports = router