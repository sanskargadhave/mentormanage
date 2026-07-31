const SemesterScema = require("../model/SemesterScema");


const getCurrentSemester = async () => {
    return await SemesterScema.findOne({
        isCurrent: true,
        status: "active"
    });
};

const isDateWithinRange = (date, startDate, endDate) => {
    const current = new Date(date);

    return current >= startDate && current <= endDate;
};

module.exports = {
    getCurrentSemester,
    isDateWithinRange
};