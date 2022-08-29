/*const express=require('express');
const router=new express.Router();
require('../db/config');
const modulData=require("../modul/datamodul");

router.get("/list/:_id", async (req, res) => {
    
    let datas = modulData.find(req.params);
    let result = await datas;
    res.send(result)
})



module.exports=router;
*/