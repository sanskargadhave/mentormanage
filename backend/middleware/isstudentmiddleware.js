const isStudent= (req, res, next) => {
    if (req.user?.role !== "Student") {    
        return res.status(403).json({ message: "Access denied. Student only." });
    }
    next();
};

module.exports = isStudent;