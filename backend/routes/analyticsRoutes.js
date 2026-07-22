const express=require("express");
const router=express.Router();
const db=require("../config/db");
const {auth}=require("../middleware/auth");
const analyticsController=require("../controllers/analyticsController");

// analytics api
// router.get("/",auth,(req,res)=>{
//     const query1="SELECT COUNT(*) AS totalTasks ,SUM(completed=1) AS completedTasks ,SUM(completed=0) AS pendingTasks ,ROUND(SUM(completed=1)*100/COUNT(*),2) AS completionRate FROM tasks WHERE user_id=?";
//     db.query(query1,[req.user.id],(err,taskResult)=>{
//         if(err){
//             return res.status(500).json({
//                 message:err.message
//             })
//         }
//         // res.json(result)

//         const query2="SELECT COUNT(*) AS upcomingEvents FROM events WHERE user_id=? AND event_date>=CURDATE()";

//         db.query(query2,[req.user.id],(err,eventResult)=>{
//             if(err){
//                 return res.status(500).json({
//                     message:err.message
//                 })
//             }

//             const query3="SELECT category,COUNT(*) AS count FROM tasks WHERE user_id=? GROUP BY category";

//             db.query(query3 ,[req.user.id],(err,categoryResult)=>{
//                 if(err){
//                     return res.status(500).json({
//                     message:err.message
//                 });
//                 }

//                 const query4="SELECT priority,COUNT(*) AS count FROM tasks WHERE user_id=? GROUP BY priority";

//                 db.query(query4 ,[req.user.id],(err,priorityResult)=>{
//                     if(err){
//                         return res.status(500).json({
//                             message:err.message
//                         })
//                     }

//                     const query5="SELECT MONTH(due_date) AS monthNumber, MONTHNAME(due_date) AS month, COUNT(*) AS count FROM tasks WHERE user_id=? GROUP BY MONTH(due_date), MONTHNAME(due_date) ORDER BY MONTH(due_date)";

//                     db.query(query5,[req.user.id],(err,monthResult)=>{
//                         if(err){
//                             return res.status(500).json({
//                                 message:err.message
//                             });
//                         }

//                         const query6=`SELECT 
//                         DAYNAME(due_date) AS day,
//                         DAYOFWEEK(due_date) AS dayOrder,
//                         SUM(completed=1) AS completed,
//                         SUM(completed=0) AS remaining
//                         FROM tasks
//                         WHERE user_id=?
//                         AND YEARWEEK(due_date, 1)=YEARWEEK(CURDATE(), 1)
//                         GROUP BY DAYNAME(due_date), DAYOFWEEK(due_date)
//                         ORDER BY dayOrder`;
                        
//                         db.query(query6,[req.user.id],(err,weekResult)=>{
//                             if(err){
//                                 return res.status(500).json({
//                                     message:err.message
//                                 })
//                             }

//                             res.json({
//                                 overview:{
//                                     totalTasks:taskResult[0].totalTasks ||0,
//                                     completedTasks:taskResult[0].completedTasks||0,
//                                     pendingTasks:taskResult[0].pendingTasks ||0,
//                                     completionRate:taskResult[0].completionRate ||0,
//                                     upcomingEvents:eventResult[0].upcomingEvents ||0
//                                 },
//                                  weeklyProductivity: weekResult,
//                                     categories:categoryResult,
//                                     priority:priorityResult,
//                                     monthResult:monthResult
//                             });
//                         })
//                     })
//                 })
//             })
//         })

//     })
// });


router.get("/",auth,analyticsController.analytics);

module.exports=router;