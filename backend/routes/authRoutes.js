const express=require("express");
const router=express.Router();
const db=require("../config/db");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {auth}=require("../middleware/auth");
const authController=require("../controllers/authController");
require("dotenv").config();

// post route for register
// router.post("/register", async(req,res)=>{
//     const {
//         username,
//         email,
//         password
//     }=req.body;

//     console.log(req.body);

//     try{
//         const hashedPassword=
//         await bcrypt.hash(password,10)

//         const role = req.body.role || "user";
//         const q="INSERT INTO users (username,email,password,role) values (?,?,?,?)";
//         db.query(q,[username,email,hashedPassword,role],(err,result)=>{
//             if(err){
//                 return res.status(500).json({
//                     error:err.message
//                 });
//             }
//             res.json({
//                 message:"User Registered"
//             });
//         });
//     }
//     catch(err){
//         console.log(err); 
//     }
// });

// router.post("/login",(req,res)=>{
//     const {email,password}=req.body;
//     const q=`SELECT id,username, email, password, role FROM users WHERE email=?`;

//     db.query(q,[email],async(err,result)=>{
//         if(err){
//             return res.status(500).json({
//                 error:err.message
//             })
//         }
//         if(result.length === 0){
//             return res.status(404).json({
//                 message:"user not found!"
//             })
//         }
//         const user=result[0];

//         const match= await bcrypt.compare(password,user.password);

//         if(!match){
//             return res.status(401).json({
//                 message:"Wrong password"
//             });
//         }

//         const eventQuery=`INSERT INTO app_events (user_id,event_type) VALUES(?,'User Login')`;
//         db.query(eventQuery,[user.id],(eventInsertErr,eventInsertResult)=>{
//             if(eventInsertErr) console.error("failed to insert login event",eventInsertErr);

//         // update the last_login date 
//         const updateLoginQuery="UPDATE users SET last_login =NOW() WHERE id=?";
//         db.query(updateLoginQuery,[user.id],(updateErr,updateResult)=>{
//             if(updateErr) console.error("failed to update last login",updateErr);
       
//         const token=jwt.sign({
//             id:user.id,
//             email:user.email,
//             role:user.role || "user"
//         },
//         process.env.JWT_SECRET,
//         { expiresIn:"1d"
//         }
        
//     );
//         res.json({
//             message:"Login Success",
//             token,
//             user:{
//                 id:user.id,
//                 username:user.username,
//                 email:user.email,
//                 role:user.role || "user"
//             }
//         }); 
//          });

//         });
        
//     })

// });

router.post("/register",authController.register);
router.post("/login",authController.login);


router.get("/profile",
    auth,(req,res)=>{
        res.json({
            user:req.user
        });
    }
);

module.exports=router;