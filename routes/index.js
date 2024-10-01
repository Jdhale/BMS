const express=require('express');
const router=express.Router();
const db = require('../config/database').db;

router.get('/',(req,res)=>{
    res.render('main')
});
router.get("/login",(req,res)=>{
    res.render("login");
});
router.get("/register",(req,res)=>{
    res.render("register");
});
router.get("/adduser",(req,res)=>{
    res.render("adduser");
});

router.get("/viewTransaction",(req,res)=>{
    res.render("viewTransaction");
});

router.get("/deleteuser",(req,res)=>{
    res.render("deleteuser");
});

router.get("/viewUsers",(req,res)=>{
    res.render("viewUsers");
});
router.get("/admin_dash",(req,res)=>{
    res.render("admin_dash");
});

router.get("/user_dash",(req,res)=>{
    res.render("user_dash");
});
 
 
module.exports=router;