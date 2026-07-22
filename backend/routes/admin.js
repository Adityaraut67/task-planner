const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { auth, isAdmin } = require("../middleware/auth");
const adminController=require("../controllers/adminController");
// router.get("/", [auth, isAdmin], (req, res) => {
    
//     // 1. Total Users
//     const q1 = "SELECT COUNT(*) AS totalUsers FROM users";
//     db.query(q1, (err, userCountResult) => {
//         if (err) return res.status(500).json({ success: false, message: err.message });
//         const totalUsers = userCountResult[0].totalUsers;

//         // 2. Total Tasks & Completion Rate
//         const q2 = "SELECT COUNT(*) AS totalTasks, SUM(CASE WHEN completed=1 THEN 1 ELSE 0 END) AS completed FROM tasks";
//         db.query(q2, (err, tasksResult) => {
//             if (err) return res.status(500).json({ success: false, message: err.message });
            
//             const totalTasks = tasksResult[0].totalTasks;
//             const totalCompletedTask = tasksResult[0].completed || 0;
            
//             // Safe calculation to prevent dividing by zero
//             const completionRate = totalTasks > 0 ? Math.round((totalCompletedTask / totalTasks) * 100) : 0;

//             // 3. Active Users
//             const activeUserQ = `SELECT COUNT(*) AS activeusers FROM users WHERE last_login >= NOW() - INTERVAL 7 DAY`;    
//             db.query(activeUserQ, (err, activeUserResult) => {
//                 if (err) return res.status(500).json({ success: false, message: err.message });
//                 const activeUser = activeUserResult[0].activeusers;

//                 // 4. User Growth
//                 const userGrowthQuery = `
//                     SELECT DAYNAME(joined_at) AS day, COUNT(*) AS count FROM users
//                     WHERE joined_at >= NOW() - INTERVAL 7 DAY 
//                     GROUP BY DAYNAME(joined_at), DAYOFWEEK(joined_at)
//                     ORDER BY DAYOFWEEK(joined_at)
//                 `;
//                 db.query(userGrowthQuery, (err, growthResult) => {
//                     if (err) return res.status(500).json({ success: false, message: err.message });
                    
//                     // Format User Growth (Mon - Sun Bar Chart)
//                     const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
//                     let formattedGrowth = weekDays.map(dayAbbr => {
//                         const foundDay = growthResult.find(r => r.day.substring(0, 3) === dayAbbr);
//                         return { day: dayAbbr, count: foundDay ? foundDay.count : 0 };
//                     });

//                     // UPDATED: Calculate the dynamic height percentage for the React bars
//                     const maxGrowthCount = Math.max(...formattedGrowth.map(d => d.count), 1); // Use 1 to avoid NaN
//                     formattedGrowth = formattedGrowth.map(d => ({
//                         ...d,
//                         height: `${Math.round((d.count / maxGrowthCount) * 100)}%`
//                     }));

//                     // 5. Server Traffic Distribution
//                     const trafficQuery = `
//                         SELECT HOUR(created_at) AS hour, COUNT(*) AS activityCount 
//                         FROM app_events 
//                         GROUP BY HOUR(created_at) 
//                         ORDER BY activityCount DESC
//                     `;
//                     db.query(trafficQuery, (err, trafficResult) => {
//                         if (err) return res.status(500).json({ success: false, message: err.message });

//                         // UPDATED: Use a raw count bucket first to safely calculate percentages
//                         let activityBuckets = [
//                             { time: '08AM', rawCount: 0 },
//                             { time: '12PM', rawCount: 0 },
//                             { time: '04PM', rawCount: 0 },
//                             { time: '08PM', rawCount: 0 }
//                         ];
//                         let totalActions = 0;
//                         let peakHourString = "N/A";

//                         if (trafficResult.length > 0) {
//                             const peak = trafficResult[0].hour; 
//                             const ampm = peak >= 12 ? 'PM' : 'AM';
//                             const displayHour = peak % 12 || 12;
//                             peakHourString = `${displayHour}:00 ${ampm}`;

//                             trafficResult.forEach(row => {
//                                 totalActions += row.activityCount;
//                                 if (row.hour >= 6 && row.hour < 11) activityBuckets[0].rawCount += row.activityCount;      
//                                 else if (row.hour >= 11 && row.hour < 15) activityBuckets[1].rawCount += row.activityCount; 
//                                 else if (row.hour >= 15 && row.hour < 19) activityBuckets[2].rawCount += row.activityCount; 
//                                 else activityBuckets[3].rawCount += row.activityCount;                                      
//                             });
//                         }
                        
//                         // UPDATED: Convert to the exact `{ time: "08AM", percent: "40%" }` format for React
//                         const formattedActivity = activityBuckets.map(bucket => {
//                             const pct = totalActions > 0 ? Math.round((bucket.rawCount / totalActions) * 100) : 0;
//                             return { time: bucket.time, percent: `${pct}%` };
//                         });
                        
//                         // 6. Recent Users
//                         const recentUsersQuery = `SELECT id, username, email, role, joined_at AS joinedAt FROM users ORDER BY joined_at DESC LIMIT 5`;
//                         db.query(recentUsersQuery, (err, recentUsers) => {
//                             if (err) return res.status(500).json({ success: false, message: err.message });

//                             // 7. Recent AI Plans
//                             const aiPlansQuery = `
//                                 SELECT p.id, p.prompt AS plan, u.username, p.status 
//                                 FROM plans p LEFT JOIN users u ON p.user_id = u.id
//                                 ORDER BY p.created_at DESC LIMIT 5
//                             `;
//                             db.query(aiPlansQuery, (err, aiPlanResult) => {
//                                 if (err) return res.status(500).json({ success: false, message: err.message });
                                
//                                 res.json({
//                                     success: true,
//                                     metrics: {
//                                         totalUsers: totalUsers,
//                                         totalTasks: totalTasks,
//                                         activeUser: activeUser,
//                                         completionRate: completionRate
//                                     },
//                                     charts: {
//                                         userGrowth: formattedGrowth,
//                                         dailyActivity: formattedActivity, // Now contains 'percent' string
//                                         peakHour: peakHourString
//                                     },
//                                     recentUsers: recentUsers,
//                                     aiPlans: aiPlanResult
//                                 });
                                
//                             }); // End AI Plans
//                         }); // End Recent Users
//                     }); // End Traffic
//                 }); // End User Growth
//             }); // End Active Users
//         }); // End Tasks
//     }); // End Total Users
// });

router.get("/admin",[auth,isAdmin],adminController.admin);

module.exports = router;