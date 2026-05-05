const isMentor = (req, res, next) => {
    if (req.user?.role !== "Mentor") {
        console.log("Access denied. Mentor only")
        return res.status(403).json({ message: "Access denied. Mentor only." });
    }
    next();
};

module.exports = isMentor;