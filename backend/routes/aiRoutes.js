const express=require("express");
const router=express.Router();
const ai=require("../config/gemini");
const db=require("../config/db");
const {auth}=require("../middleware/auth");
const aiController=require("../controllers/aiController")

// router.post("/generate-plan",auth,async (req,res)=>{
   
//     const {prompt} =req.body;
//     const systemPrompt = `
//        You are an AI Study Planner. 

// Generate a personalized study plan.

// Return ONLY valid JSON.

// Rules:
// 1. Do not return markdown.
// 2. Do not use \`\`\`json.
// 3. Return JSON only.
// 4. difficulty must be exactly one of:
//    - Easy
//    - Medium
//    - Hard
// 5. priority must be exactly one of:
//    - High
//    - Medium
//    - Low
// 6. estimated_hours_per_day must be between 1 and 8.
// 7. estimated_hours must be between 1 and 8.
// 8. Number of tasks must equal duration_days.

// JSON Format:

// {
//   "goal":"",
//   "summary":"",
//   "duration_days":0,
//   "difficulty":"",
//   "estimated_hours_per_day":0,
//   "tasks":[
//       {
//         "day":1,
//         "title":"",
//         "description":"",
//         "priority":"",
//         "estimated_hours":0
//       }
//   ]
// }

// User Prompt:
// ${prompt}`;
   
//     try{
//         const response= await ai.models.generateContent({
//             model:"gemini-2.5-flash",
//             contents:systemPrompt
//         });

//         // remove markdown 

//         let plan =response.text;
//         plan =plan.replace(/```json/g ,"").replace(/```/g,"").trim();

//         plan =JSON.parse(plan);
        

//         // store the plan 
//         const q =`INSERT INTO plans ( 
//         user_id,
//         prompt ,
//         goal,
//         summary,
//         duration_days,
//         estimated_hours_per_day,
//         difficulty
//         ) VALUES (?,?,?,?,?,?,?)`;

//         db.query(q,[req.user.id ,
//             prompt ,
//             plan.goal ,
//             plan.summary,
//             plan.duration_days ,
//             plan.estimated_hours_per_day ,
//             plan.difficulty] ,
//             (err,result)=>{
               
//                 if(err){
//                     return res.status(500).json({
//                         message:err.message
//                     })
//                 }

//                 const q2=`INSERT INTO plan_tasks (plan_id,day_number,title,description,priority,estimated_hours) VALUES(?,?,?,?,?,?)`;
//                 const plan_id=result.insertId;
                


//                 // if no tasks generated
//                 if(!plan.tasks || plan.tasks.length ===0){
//                     return res.status(400).json({
//                         success:false,
//                         message:"AI did not generate any tasks"
//                     })
//                 }

//                 // using a inserted var to track the insert
//                 let inserted=0;

//                 for(const task of plan.tasks){
//                     db.query(q2 ,[plan_id,task.day ,task.title ,task.description ,task.priority ,task.estimated_hours] ,(err,result2)=>{
//                         if(err){
//                             return res.status(500).json({
//                                 message:err.message
//                             })
//                         }
//                         inserted++;

//                         // if all task inserted
//                         if(inserted === plan.tasks.length){

//                          res.json({
//                             success:true,
//                             message:"plan generated successfully",
//                             planId:plan_id,
//                             plan :plan
//                         });
//                     }

//                     })
//                 }
                
//                 console.log("plan stored in the database")            
//         })

       
//     } catch(err){
//         console.log(err);

//         res.status(500).json({
//             success:false ,
//             error:err.message
//         })
//     }
// });

// // get single plan
// router.get("/plans/:id",auth,async(req,res)=>{
//     const {id}=req.params;

//     const q=`SELECT * FROM plans WHERE id=? AND user_id=?`;

//     db.query(q,[id,req.user.id],async(err,result1)=>{
//         if(err){
//             return res.status(500).json({
//                 message:err.message
//             });
//         }

//         if(result1.length ===0){
//             return res.status(404).json({
//                 success:false,
//                 message:"plan not found"
//             });
//         }
//         const q2=`SELECT * FROM plan_tasks WHERE plan_id=? `;

//         db.query(q2 ,[id],async(err,result2)=>{
//             if(err){
//                 return res.status(500).json({
//                     message:err.message
//                 })
//             }

//             res.json({
//                 plan:result1[0],
//                 tasks:result2
//             });
//         });
//     });
        
// });

// // get my plans
// router.get("/plans",auth,async (req,res)=>{
//     const q=`SELECT * FROM plans WHERE user_id=?`;

//     db.query(q,[req.user.id],(err,result)=>{
//         if(err){
//             return res.status(500).json({
//                 message:err.message
//             });
//         }
//         res.json(result);
//     });
// });

// // accept plan
// router.post("/plans/:id/accept",auth,async (req,res)=>{
//     const {id}=req.params;
//     const {start_date ,schedule_mode,schedule_days}=req.body;
//     //  here user is accepting the plan and then the tasks are added
//     // in the tasks table  - there are 3 mode (daily ,weekdays,weekends,custom)
//     // case 1 -daily
//     if(!start_date || !schedule_mode ){
//         return res.status(400).json({
//             success:false,
//             message:"start date and schedule mode are required"
//         });
//     }
//     // plan id belongs to the logged in user (handled in where clause)
//     // take out the plan
//     const q1=`SELECT * FROM  plans WHERE id=? AND user_id=?`;
//     db.query(q1,[id,req.user.id],(err,result)=>{
//         if(err){
//             return res.status(500).json({
//                 message:err.message
//             });
//         }
//         if(result.length === 0){
//             return res.status(404).json({
//                 success:false,
//                 message:"plan not found"
//             });
//         }
//         // to prevent double accepting same plan
//         if(result[0].status ==="Accepted"){
//             return res.status(400).json({
//                 success:false,
//                 message:"This plan has already been accepted"
//             })
//         }
//         //  update the plan 
//         const q2 =`UPDATE plans SET schedule_mode=?,start_date=? ,status='Accepted',schedule_days=? WHERE id=?`;

//         db.query(q2,[schedule_mode ,start_date,schedule_days,id],(err,result2)=>{
//             if(err){
//                 return res.status(500).json({
//                     message:err.message
//                 });
//             }

//     if(schedule_mode ==="daily"){
//     const q3= `SELECT * FROM plan_tasks WHERE  plan_id =? ORDER BY day_number`;
//     db.query(q3,[id],(err,result3)=>{
//         if(err){
//                 return res.status(500).json({
//                     message:err.message
//                 });
//             }

//             if(result3.length===0){
//                  return res.status(404).json({
//                    success:false,
//                    message:"No tasks found for this plan"
//                   });
// }

//             let inserted=0;
//             const startDate=new Date(start_date);
            
//             const q4=`INSERT INTO tasks (title,priority,due_date,user_id,description,estimated_hours) VALUES(?,?,?,?,?,?)`;
//             for(const task of result3){
//                 const due_date=new Date(startDate);
//                 due_date.setDate(
//                     due_date.getDate() + (task.day_number -1)
//                 );
//                 const due_dateString=due_date.toISOString().split("T")[0];
                

//                 db.query(q4,[task.title ,task.priority,due_dateString,req.user.id,task.description,task.estimated_hours],(err,result4)=>{
//                     if(err){
//                         return res.status(500).json({
//                             message:err.message
//                         })
//                     }
//                     inserted++;

//                     if(inserted === result3.length){
//                     res.json({
//                         success:true,
//                         message:"tasks added successful!"
//                     });
//                 }
//                 });
//             }
//     });

//         } });
        
//     });


//     });    

   
router.post("/generate-plan",auth, aiController.generatePlan );
router.get("/plans/:id",auth,aiController.getPlan);
router.get("/plans",auth,aiController.getPlans);
router.post("/plans/:id/accept",auth,aiController.acceptPlan);

module.exports=router;