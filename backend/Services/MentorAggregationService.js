const {StoreStudent}= require("../model/studentSchema");
const mongoose = require("mongoose");
const {StoreLecture,StoreAttendance}=require("../model/AttendanceSchema");
const MentorAnalyticAggregation= async (currentSemester,studentList,id)=>{
    const studentIds = studentList.map(student => student._id);
    
    return await StoreAttendance.aggregate([
        // =====================================================
            // COMMON FILTER
        // =====================================================
        {
            $match: {
                date: {
                    $gte: new Date(currentSemester.attendanceStartDate),
                    $lt: new Date(currentSemester.attendanceEndDate)
                },                
                submitedById: id
            }
        },
        // =====================================================
        // ALL ANALYTICS RUN INDEPENDENTLY
        // =====================================================
        {
            $facet: {
                // =================================================
                    // 1. LECTURE ACTIVITY
                // =================================================

                LectureActivity: [

                    // Group attendance document by date
                    {
                        $group: {
                            _id: "$date",
                            totalLecture: { $sum: 1 }
                        }
                    },

                    // Calculate week number
                    {
                        $addFields: {
                            weekNumber: {
                                $add: [
                                    {
                                        $floor: {
                                            $divide: [
                                                {
                                                    $dateDiff: {
                                                        startDate: new Date(currentSemester.attendanceStartDate),
                                                        endDate: "$_id",
                                                        unit: "day"
                                                    }
                                                },7
                                            ]
                                        }
                                    },1
                                ]
                            }
                        }
                    },
                    // Combine dates into weeks
                    {
                        $group: {
                            _id: "$weekNumber",
                            totalLecture: { $sum: "$totalLecture" }
                        }
                    },
                    {
                        $sort: { _id: 1 }
                    },
                    {
                        $project: {
                            _id: 0,
                            weekNumber: "$_id",
                            totalLecture: 1
                        }
                    }
                ],

                // =================================================
                // 2. MENTOR OVERVIEW
                // =================================================

                MentorOverview: [
                    { $unwind: "$attendance" },
                    {
                        $match:{
                            "attendance.studentId":{$in:studentIds}
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            present: { $sum: { $cond: [ { $eq: [ "$attendance.status","Present"]},1,0]}}
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            total: 1,
                            present: 1,
                            averageAttendance: { 
                                $round: [
                                    { $multiply: 
                                        [ 
                                            { $divide: [ "$present", "$total"]},
                                         100]},1]
                            }
                        }
                    }
                ],

                // =================================================
                // 3. STUDENTS BELOW 75%
                // =================================================

                StudentsBelow75: [
                    { $unwind: "$attendance"},
                    {
                        $match:{
                            "attendance.studentId":{$in:studentIds}
                        }
                    },
                    {
                        $group: {
                            _id: "$attendance.studentId",
                            totalLecture: { $sum: 1 },
                            totalPresent: { $sum: { $cond: [ { $eq: [ "$attendance.status", "Present" ] }, 1, 0] } }
                        }
                    },
                    {
                        $addFields: {
                            attendancePercentage: {
                                $multiply: [
                                    {
                                        $divide: [
                                            "$totalPresent",
                                            "$totalLecture"
                                        ]
                                    }, 100
                                ]
                            }
                        }
                    },
                    {
                        $match: {
                            attendancePercentage: { $lt: 75 }
                        }
                    },

                    {
                        $lookup: {
                            from: "StudentDetails",
                            localField: "_id",
                            foreignField: "_id",
                            as: "studentdetails"
                        }
                    },

                    { $unwind: "$studentdetails"},
                    {
                        $project: {
                            _id: 1,
                            totalLecture: 1,
                            totalPresent: 1,
                            attendancePercentage: {
                                $round: [
                                    "$attendancePercentage",1
                                ]
                            },                
                            name: "$studentdetails.personaldetails.name",
                            rollno: "$studentdetails.collagedetails.rollno"
                        }
                    }
                ],


                // =================================================
                // 4. AVERAGE CLASS PERFORMANCE
                // =================================================

                AverageClassPerformance: [
                    { $unwind: "$attendance" },
                    {
                        $match:{
                            "attendance.studentId":{$in:studentIds}
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalLecture: { $sum: 1 },
                            totalPresent: {$sum: { $cond: [ { $eq: [ "$attendance.status", "Present" ]}, 1,0]}},
                            totalAbsent: {$sum: { $cond: [ { $eq: [ "$attendance.status", "Absent" ]}, 1,0]}},
                        }
                    },

                    {
                        $project: {
                            _id: 0,
                            totalLecture: 1,
                            totalPresent: 1,
                            totalAbsent: 1,
                            averageClassPerformance: {
                                $round: [
                                    {
                                        $multiply: [
                                            {
                                                $divide: [
                                                    "$totalPresent",
                                                    "$totalLecture"
                                                ]
                                            },100
                                        ]
                                    },1
                                ]
                            }
                        }
                    }
                ],


                // =================================================
                // 5. ATTENDANCE TRENDS
                // =================================================

                AttendanceTrends: [

                    {
                    $unwind: "$attendance"
                    },
                    {
                        $match:{
                            "attendance.studentId":{$in:studentIds}
                        }
                    },

                    // First calculate daily attendance
                    {
                    $group: {
                        _id: "$date",

                        totalLecture: {
                        $sum: 1
                        },

                        totalPresent: {
                        $sum: {
                            $cond: [
                            {
                                $eq: [
                                "$attendance.status",
                                "Present"
                                ]
                            },

                            1,

                            0
                            ]
                        }
                        },

                        totalAbsent: {
                        $sum: {
                            $cond: [
                            {
                                $eq: [
                                "$attendance.status",
                                "Absent"
                                ]
                            },

                            1,

                            0
                            ]
                        }
                        }
                    }
                    },

                    // Calculate week
                    {
                    $addFields: {
                        weekNumber: {
                        $add: [
                            {
                            $floor: {
                                $divide: [
                                {
                                    $dateDiff: {
                                    startDate: new Date(currentSemester.attendanceStartDate),

                                    endDate: "$_id",

                                    unit: "day"
                                    }
                                },

                                7
                                ]
                            }
                            },

                            1
                        ]
                        }
                    }
                    },

                    // Combine daily values into weekly values
                    {
                    $group: {
                        _id: "$weekNumber",

                        totalLecture: {
                        $sum: "$totalLecture"
                        },

                        totalPresent: {
                        $sum: "$totalPresent"
                        },

                        totalAbsent: {
                        $sum: "$totalAbsent"
                        }
                    }
                    },

                    {
                    $addFields: {
                        attendancePercentage: {
                        $multiply: [
                            {
                            $divide: [
                                "$totalPresent",
                                "$totalLecture"
                            ]
                            },

                            100
                        ]
                        }
                    }
                    },

                    {
                    $sort: {
                        _id: 1
                    }
                    },

                    {
                    $project: {
                        _id: 0,

                        weekNumber: "$_id",

                        totalLecture: 1,

                        totalPresent: 1,

                        totalAbsent: 1,

                        attendancePercentage: {
                        $round: [
                            "$attendancePercentage",

                            1
                        ]
                        }
                    }
                    }
                ],


                // =================================================
                // 6. STUDENT ATTENDANCE DISTRIBUTION
                // =================================================

                StudentAttendanceDistribution: [

                    { $unwind: "$attendance" },
                    {
                        $match:{
                            "attendance.studentId":{$in:studentIds}
                        }
                    },
                    // Group by student
                    {
                        $group: {
                            _id: "$attendance.studentId",
                            totalPresent: {$sum: { $cond: [ { $eq: [ "$attendance.status", "Present" ]}, 1,0]}}, 
                            totalLecture: { $sum: 1 }
                        }
                    },
                    // Student details
                    {
                        $lookup: {
                            from: "StudentDetails",
                            localField: "_id",
                            foreignField: "_id",
                            as: "StudentData"
                        }
                    },

                    { $unwind: "$StudentData"},

                    // Calculate percentage
                    {
                        $addFields: {
                            attendancePercentage: {
                                $round: [
                                    {
                                        $multiply: [
                                            {
                                                $divide: [ "$totalPresent", "$totalLecture"]
                                            },100
                                        ]
                                    },1
                                ]
                            }
                        }
                    },
                    // Category
                    {
                        $addFields: {
                            category: {
                                $switch: {
                                    branches: [

                                        {
                                            case: {
                                                $gte: ["$attendancePercentage",85]
                                            },
                                            then: "Excellent"
                                        },

                                        {
                                            case: {
                                                $gte: [ "$attendancePercentage", 75 ]
                                            },
                                            then: "Good"
                                        },

                                        {
                                            case: {
                                                $gte: [ "$attendancePercentage", 60 ]
                                            },
                                            then: "Warning"
                                        }
                                    ],

                                    default: "Critical"
                                }
                            }
                        }
                    },

                    // Group category
                    {
                        $group: {
                            _id: "$category",

                            count: { $sum: 1 },

                            students: {
                                $push: {
                                    studentId: "$_id",
                                    name: "$StudentData.personaldetails.name",
                                    rollno: "$StudentData.collagedetails.rollno",
                                    totalPresent: "$totalPresent",
                                    totalLecture: "$totalLecture",
                                    attendancePercentage: "$attendancePercentage"
                                }
                            }
                        }
                    },

                    {
                        $project: {
                            _id: 0,
                            category: "$_id",
                            count: 1,
                            students: 1
                        }
                    }
                ]
            }
        }
    ])
}

module.exports={MentorAnalyticAggregation};