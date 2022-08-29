require('dotenv').config()
const express = require('express');
var cookieParser = require('cookie-parser')
const path = require('path');
const bcrypt = require('bcryptjs');
const partials = require('partials');
const hbs = require('hbs');
const bodyParser = require('body-parser');
require("./db/config");
const modulData = require("./modul/datamodul");
const router = require("./router/contanair");
const auth=require('./middleware/auth');

/// used mathode
const app = express();
let port =process.env.PORT || 8080;
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
// paths
let templeat_path = path.join(__dirname, '../templeat/views');
let public_path = path.join(__dirname, './public');
let partials_partials = path.join(__dirname, '../templeat/partials');
//sets
app.set('view engine', 'hbs');
app.set('views', templeat_path);
//useds
hbs.registerPartials(partials_partials);
app.use(express.static(public_path));
app.use(express.static("."));


//app.use(router);
app.get("/", (req, res) => {
    res.render('index');
})


app.get("/contect", (req, res) => {
    res.render("contect");
})

app.post("/contect", async (req, res) => {
    ////////////// two type to insert data in database
    // let fname=req.body.name;
    // let femail=req.body.email;
    // let pass=req.body.password;


    let detail = {
      //three type
      ///// first
        // name: req.body.name,
        // email: req.body.email,
        // password: req.body.password
        //// secon type
        // "name":fname,
        // "email":femail,
        // "password":pass
    }
    let datas = new modulData({
        //// third type
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

   let token= await datas.generateAuthToken();
   console.log(token);

  //// creat a cookies
   res.cookie("jwt",token,{
    httpOnly:true,
   })
   //console.log(cookie)

    let result = await datas.save();
    console.log(result)
    res.render('success')
    // res.send("data store susscesfully");

})

app.get("/login", (req, res) => {
    res.render('login');
})

app.post("/login", async (req, res) => {

    /// two type 1 login
    try {
        let email = req.body.email;
        let password = req.body.password;
        let check = await modulData.findOne({ email: email });
        /////token gernate
        let token =await check.generateAuthToken();
        console.log(token);
         
      /////// create cookies
      res.cookie("jwt",token,{
        expires: new Date(Date.now()+ 1000000),
        httpOnly:true
        //secure:true
      });

          //// compare the  password  normal to bcrypt 
        let isMatch = await bcrypt.compare(password, check.password);
        if (isMatch) {
            res.render('index', { email: email })
        }
        else {
            res.render("faild");
        }
    } catch (error) {
        res.render("faild");
    }

    /// two type 2 login
    /*
        let email = req.body.email;
        let password = req.body.password;
        let check =await modulData.findOne({ email: email});
        let result = await check;
        let  isMatch= await bcrypt.compare(password,check.password);
         
       
          
    
        if ( result !=null && isMatch) {
             res.render('index', { email: email });
        }
        else {
            res.render("faild");
        }*/
})




app.get("/about",auth, (req, res) => {
  //console.log(`this is coookies    ${req.cookies.jwt}`);
    res.render('about');
})

app.get("/logout",auth, async (req, res) => {
    try{
      res.clearCookie("jwt");
      console.log('logout successfuly');
      await req.user.save();
     // res.render('faild')
    }
    catch(error){
        res.status(500).render('login');
    }
 
  })
  

app.listen(port, () => {
    console.log(`this is my port${port}`);
})




// nodemon .\src\index.js -e .js,.hbs,.css