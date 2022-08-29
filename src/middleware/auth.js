const jwt=require('jsonwebtoken');
const modulData = require("../modul/datamodul");
//var cookieParser = require('cookie-parser')

const auth=async (req,res,next)=>{
    try{
const token=req.cookies.jwt;

const checkAuth=jwt.verify(token,process.env.SECRET_KEY);

console.log(checkAuth);
const user=await modulData.findOne({_id:checkAuth._id});
//console.log(user)
req.checkAuth;
req.user;

next();
}
 catch(error){
    res.status(401).send('This Is Unauthorized');
}
}


module.exports=auth;