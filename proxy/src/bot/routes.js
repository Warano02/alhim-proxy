const router=require("express").Router()

router.post("/",(req,res)=>res.json({error:false,msg:"L'ia va repondre ici "}))

module.exports =router