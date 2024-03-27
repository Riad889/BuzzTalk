const jwt=require('jsonwebtoken');
const User=require('../models/userSchema');
const protect=async(req,res)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token=req.headers.authorization.split(" ")[1];
            console.log(token)

            const decoded=jwt.verify(token,process.env.jwtSecret)
            req.user=await User.findById(decoded.id).select('-password');//password means without the password
            next()
        } catch (error) {
            return res.status(402).json({message:"Token failed"});
        }


    }
    else {
        return res.status(402).json({message:"Not authorized, No token"})
    }


}

module.exports=protect;