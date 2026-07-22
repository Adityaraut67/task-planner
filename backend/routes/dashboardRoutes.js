const express=require("express");
const router=express.Router();
const db=require("../config/db");
const {auth}=require("../middleware/auth");
const dashboardController=require("../controllers/dashboardController")

// dashboard api
// router.get("/",auth,(req,res)=>{
//     const taskQuery="SELECT COUNT(*) AS totalTask , SUM(completed=1) AS completedTasks ,SUM(completed=0) AS pendingTasks FROM tasks WHERE user_id=?";

//     db.query(taskQuery,[req.user.id] ,(err,taskResult)=>{
//         if(err){
//             return res.status(500).json({
//                 message:err.message
//             })
//         }   
    
//     const eventQuery=`SELECT title,event_date,priority,event_time ,location FROM events WHERE user_id=? AND event_date>=CURDATE() AND DATEDIFF(event_date,CURDATE())<=7`;

//     db.query(eventQuery ,[req.user.id],(err,eventResult)=>{
//         if(err){
//             return res.status(500).json({
//                 message:err.message
//             });
//         } 
//          const todayTaskQuery=`SELECT * FROM tasks WHERE user_id =? AND due_date=CURDATE()`;

//         db.query(todayTaskQuery ,[req.user.id] ,(err,todaysTasks)=>{
//             if(err){
//                 return res.status(500).json({
//                     message:err.message
//                 })
//             }
            
//             const recentActivityQuery="SELECT id,event_type AS action ,created_at AS Time FROM app_events WHERE user_id=? ORDER BY created_at DESC LIMIT 5";
//             db.query(recentActivityQuery,[req.user.id],(recentActivityErr,recentActivityResult)=>{
//                 if(recentActivityErr){
//                     return res.status(500).json({
//                         success:false,
//                         message:recentActivityErr.message
//                     })
//                 }

//            res.json({
//             totalTasks:taskResult[0].totalTask,
//             completedTasks:taskResult[0].completedTasks || 0,
//             pendingTasks:taskResult[0].pendingTasks || 0,
//             totalEvents:eventResult.length  ,
//             upcomingEvents:eventResult.length || 0,
//             todaysEvents:eventResult || 0,
//             todaysTasks :todaysTasks,
//             recentActivity:recentActivityResult
            
//         });
//     });
//     });

//           });

//          });
// });

router.get("/",auth,dashboardController.getDashboardData);

module.exports=router;