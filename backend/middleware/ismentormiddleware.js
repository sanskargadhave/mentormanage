const isMentor = (req, res, next) => {
    if (req.user?.role !== "Mentor") {    
        return res.status(403).json({ message: "Access denied. Mentor only." });
    }
    next();
};

module.exports = isMentor;