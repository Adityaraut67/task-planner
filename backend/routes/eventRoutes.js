const express=require("express");
const router=express.Router();
const db=require("../config/db");
const {auth}=require("../middleware/auth");
const eventController=require("../controllers/eventController");
// rest api's for events 

// router.get("/",auth,(req,res)=>{
//     const user_id=req.user.id;
//     const q="SELECT * FROM events where user_id=? ORDER BY event_date,event_time";  
//         db.query(q,[user_id],(err,result)=>{
//             if(err){
//                 return res.status(500).json({
//                     message:err.message
//                 })
//             }
//             res.json(result);
//         })    
// });

// single event
// router.get("/:id",auth,(req,res)=>{
//     const {id}=req.params;
    
//     const q="SELECT * FROM events WHERE id=? AND user_id=?";
    
//     db.query(q,[id,req.user.id],(err,result)=>{
//         if(err){
//             return res.status(500).json({
//                 message:err.message
//             });
//         }
//         res.json(result)
//     })
// });
// BONUS api
// router.get("/upcoming",auth,(req,res)=>{
//     const q="SELECT * FROM events WHERE user_id=? AND event_date>=CURDATE() ORDER BY event_date,event_time";

//     db.query(q,[req.user.id],(err,result)=>{
//         if(err){
//             return res.status(500).json({
//                 message:err.message
//             })
//         }
//         res.json(result)
//     })
// });
// todays event
// router.get("/today",auth,(req,res)=>{
//     const q="SELECT * FROM events WHERE user_id=? AND event_date=CURDATE()";
//     db.query(q,[req.user.id],(err,result)=>{
//         if(err){
//             return res.status(500).json({
//                 message:err.message
//             })
//         }
//         res.json(result)
//     })
// });


// router.post("/",auth,(req,res)=>{
//     const {title,
//         description ,
//         event_date,
//         event_time,
//         location ,
//         category,
//         priority,
//         reminder,
//         completed} =req.body;
//         console.log("event added");
        
//         console.log(req.body);
        

//         const user_id=req.user.id;

//     const q=`INSERT INTO events (title,description ,event_date, event_time, location , category, priority,
//         reminder,completed,user_id) values(?,?,?,?,?,?,?,?,?,?)`;

//         db.query(q,[title,
//         description ,
//         event_date,
//         event_time,
//         location ,
//         category,
//         priority,
//         reminder,
//         completed,
//         user_id
//         ] , (err,result)=>{
//             if(err){
//                 return res.status(500).json({
//                     message:err.message
//                 })
//             }

//             const q2="INSERT INTO app_events (user_id,event_type) VALUES(?,'Created Event')";
//             db.query(q2,[req.user.id],(err,result2)=>{
//                 if(err){
//                 return res.status(500).json({
//                     message:err.message
//                 })
//             }
//                 res.json({
//                 message:"Event created successfully",
//                 id:result.insertId
//             });
//         });
//         });
// });

// update 
// router.put("/:id",auth,(req,res)=>{
//     const {id}=req.params;

//      const {title,
//         description ,
//         event_date,
//         event_time,
//         location ,
//         category,
//         priority,
//         reminder,
//         completed} =req.body;

//     const q=" UPDATE events SET title=? ,description=?, event_date=?, event_time=?,location=?,category=?, priority=? ,reminder=?,completed=? WHERE id=? AND user_id=? ";

//     db.query(q,[title,
//         description,
//         event_date,
//         event_time,
//         location,
//         category,
//         priority,
//         reminder,
//         completed,
//         id,
//         req.user.id]
//         ,(err,result)=>{
//             if(err){
//                 return res.status(500).json({
//                     message:err.message
//                 })
//             }

//             const q2="INSERT INTO app_events (user_id,event_type) VALUES(?,'Updated Event')"
//             db.query(q2,[req.user.id],(err2,result2)=>{
//                 if(err2){
//                 return res.status(500).json({
//                     message:err2.message
//                 })
//             }
//             res.json({
//                 message:"Event Updated"
//             })
//             })
            
//         })
// });
// delete api
// router.delete("/:id",auth,(req,res)=>{
//     const user_id=req.user.id;
//     const {id}=req.params;
//     const q="DELETE FROM events WHERE user_id=? AND id=?";

//     db.query(q,[user_id,id],(err,result)=>{
//         if(err){
//                 return res.status(500).json({
//                     message:err.message
//                 })
//             }

//             const q2="INSERT INTO app_events (user_id,event_type) VALUES(?,'Deleted Event')"
//             db.query(q2,[req.user.id],(err2,result2)=>{
//                 if(err2){
//                 return res.status(500).json({
//                     message:err2.message
//                 })
//             }
//             res.json({
//                 message:"Event Deleted"
//             })
//             });
//     })
// });


router.get("/",auth,eventController.getEvents);
router.get("/:id",auth,eventController.getSingleEvent);
router.get("/upcoming",auth,eventController.upcomingEvent);
router.get("/today",auth,eventController.todaysEvent);
router.post("/",auth,eventController.createEvent);
router.put("/:id",auth,eventController.updateEvent);
router.delete("/:id",auth,eventController.deleteEvent);



module.exports=router;
