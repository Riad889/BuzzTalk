const jwt=require('jsonwebtoken');
const generateToken=(id)=>{
    return jwt.sign({id},process.env.jwtSecret,{
        expiresIn:"30d"
    })
}

module.exports=generateToken;