const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
{
    semesterId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        enum: ["Odd Semester", "Even Semester"]
    },

    semesterNumber: {
        type: Number,
        required: true,
        enum: [1, 2]
    },

    academicYear: {
        type: String,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    attendanceStartDate: {
        type: Date,
        default: function () {
            return this.startDate;
        }
    },

    attendanceEndDate: {
        type: Date,
        default: function () {
            return this.endDate;
        }
    },

    examStartDate: {
        type: Date
    },

    examEndDate: {
        type: Date
    },

    resultDeclarationDate: {
        type: Date
    },

    workingDays: {
        type: Number,
        default: 0
    },

    minimumAttendance: {
        type: Number,
        default: 75,
        min: 0,
        max: 100
    },

    status: {
        type: String,
        enum: ["Upcoming", "Active", "Completed"],
        default: "Upcoming"
    },

    isCurrent: {
        type: Boolean,
        default: false
    },

    isLocked: {
        type: Boolean,
        default: false
    },

    description: {
        type: String,
        trim: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Semester", semesterSchema,"SemesterDetails");