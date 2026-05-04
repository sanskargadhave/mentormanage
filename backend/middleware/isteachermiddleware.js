const isTeacher = (req, res, next) => {
    if (req.user?.role !== "Teacher") {
        return res.status(403).json({ message: "Access denied. Teacher only." });
    }
    next();
};

module.exports = isTeacher;