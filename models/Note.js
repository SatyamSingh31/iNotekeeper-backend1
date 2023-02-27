const mongoose = require('mongoose')
const { Schema } = mongoose;
const NotesSchema= new Schema ({

    user:{
    type: mongoose.Schema.Types.ObjectId ,    //yha hmlog notes ko user se associate kr rhe h 
    ref : 'user' //referance mai hmlog ko user model daalna hota h
    },

    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
        
    },
    tag:{
        type: String,
        default: "my note"
    },
    date:{
        type: Date,
        default: Date.now
    },
    })
    module.exports= mongoose.model('notes',NotesSchema)