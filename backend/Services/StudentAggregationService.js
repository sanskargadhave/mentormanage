const {StoreStudent}= require("../model/studentSchema");
const mongoose = require("mongoose");
const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
const StoreApplication =require("../model/applicationScema")

const AttendanceAnalyticsAggregation=async (studentId,currentSemester)=>{
    return await StoreAttendance.aggregate([
        {$unwind: "$attendance" },
        {
            $match: {
                date: {
                    $gte:new Date(currentSemester.attendanceStartDate),
                    $lt:new Date( new Date( currentSemester.attendanceEndDate).setUTCHours( 24,0,0,0))
                },
                "attendance.studentId": studentId
            }
        },
        {
            $facet: {
                AttendanceDistribution: [{
                    $group: {
                        _id: null,
                        PresentCount: { 
                            $sum: { 
                                $cond: [{$eq: [ "$attendance.status", "Present"]},1,0]
                            }
                        },
                        AbsentCount: {
                            $sum: {
                                $cond: [{ $eq: [ "$attendance.status", "Absent" ]},1, 0 ]
                            }
                        },
                        TotalCount: { $sum: 1 }
                    }
            
                }],

                AttendanceHeatmap:[
                    {
            
                        $group:{
                            _id:"$date",
                            PresentCount:{$sum:{ $cond:[{ $eq:["$attendance.status","Present"]},1,0]}},
                            AbsentCount:{$sum:{ $cond:[{ $eq:["$attendance.status","Absent"]},1,0]}},
                            TotalCount:{$sum:1},
                        } 
                    },
                    {
                        $project:{
                            _id:0,
                            PresentCount:1,
                            TotalCount:1,
                            AbsentCount:1,
                            date:"$_id"
                        }
                    },
                    {
                        $sort:{date:1}
                    }
                ],

                AttendanceTrends: [
            
                    {
            
                        $group: {
                            _id: "$date",
                            totalLecture: { $sum: 1 },
                            presentLecture: {
                                $sum: {
                                    $cond: [{$eq: ["$attendance.status","Present"]},1,0]
                                }
                            },
                            absentLecture: {
                                $sum: { 
                                $cond: [{$eq: [ "$attendance.status","Absent"] }, 1, 0]
                                }
                            }
            
                        }
            
                    },
                    {
            
                        $addFields: {
            
                            weekNumber: {
            
                                $add: [{
                                    $floor: {
                                        $divide: [{
                                            $dateDiff: { 
                                                startDate: new Date(currentSemester .attendanceStartDate),
                                                endDate:"$_id",
                                                unit: "day"
                                            }
                                        },7]
                                    }
                                },1]
                            }
                        }
            
                    },
                    {
                        $group: {
                            _id: "$weekNumber",
                            totalLecture: { $sum:"$totalLecture" },
                            totalPresent: {
                                $sum:"$presentLecture"
                            },
                            totalAbsent: { $sum: "$absentLecture"}
                        }
            
                    },
                    { $sort: { _id: 1}},
                    {
                        $project: {
                            _id: 0,
                            weekNumber: "$_id",
                            totalLecture: 1,
                            totalPresent: 1,
                            totalAbsent: 1
            
                        }
            
                    }
            
                ],
                
                SubjectTrends: [
                    {
                        $lookup: {
                            from:"LectureDetails",
                            localField:"id",
                            foreignField:"_id",
                            as:"lecture"
                
                        }
                    },
                    {$unwind: "$lecture"},
                    {
                        $group: {
                            _id:"$lecture.subject",
                            totalLecture: {$sum: 1},
                            totalPresent: {
                                $sum: {
                                    $cond:[{$eq: ["$attendance.status", "Present" ] },1,0]
                                }
                            },
                            totalAbsent: {
                                $sum: {
                                    $cond: [{$eq: [ "$attendance.status","Absent"]},1,0]
                                }
                
                            }
                
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            subject:"$_id", 
                            totalLecture: 1,
                            totalPresent: 1,
                            totalAbsent: 1
                        }
                    },
                    {$sort: {subject: 1}}
                ]
            }
        }
    ]);
}

const LeaveAnalyticsAggregation=async(studentId,currentSemester)=>{
    return await StoreApplication.aggregate([
        {
            $match: {
                senderId: studentId,
                createdAt: {
                    $gte: new Date(currentSemester.attendanceStartDate),
                    $lt: new Date(new Date(currentSemester.attendanceEndDate).setUTCHours(24,0,0,0))
                },
                type: "Leave_application"
            }
    
        },
        {
            $group: {
                _id: null,
                Total: { $sum: 1},
                Approved: {
                    $sum: {
                        $cond: [{$eq: ["$data.status","Approve"]},1, 0 ]
                    }
                },
                Rejected: {
                    $sum: {
                        $cond: [{$eq: ["$data.status","Reject"]},1, 0 ]
                    }
                },
                Pending: {
                    $sum: {
                        $cond: [{$eq: ["$data.status","Pending" ]}, 1,0]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                Total: 1,
                Approved: 1,
                Rejected: 1,
                Pending: 1
            }
        }
    ]);
}

module.exports={LeaveAnalyticsAggregation,AttendanceAnalyticsAggregation}