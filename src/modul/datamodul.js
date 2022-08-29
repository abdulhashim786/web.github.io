require('dotenv').config()
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const schemaData=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
      },
    password:{
        type:String,
         require:true,
         minlength:[3,'this is not walad password'],
         
    },
    tokens:[{
        token:{type:String,
        require:true,
    }
    }]
});

///// authantication  registration
schemaData.methods.generateAuthToken= async function(){
     try{

        let token=await jwt.sign({_id:this._id},process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token:token.toString()});
        await this.save();
        return token;

     }
     catch(error){
        res.send("this error page");
     }
}



/// hash method
schemaData.pre("save",async function(next){
     
    if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,10)
    console.log(`this is password ${this.password}`)
    }
    next();
})
    


const modulData=mongoose.model('contects',schemaData);

module.exports=modulData;