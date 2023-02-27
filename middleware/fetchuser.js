var jwt = require('jsonwebtoken');

const JWT_SECRET ='Satyamisahandsomeb$Oy'

const fetchuser=(req,res,next)=>{
    //get the user from jwt token and add id to request object
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token"})

    }
    try {
        const data =jwt.verify(token,JWT_SECRET)
    req.user = data.user  //user meko mil jayega
    console.log(data)

    next()
        
    } catch (error) {
        res.status(401).send({error:"Please authenticate using a valid token"})

        
    }
    
}

module.exports = fetchuser