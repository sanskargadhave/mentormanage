const isMentor = (req, res, next) => {

    if (req.user?.role !== "Mentor") {    
        return res.status(403).json({ success:false,message: "Access denied. Mentor only." });
    }
    console.log("Mentor Verified")
    next();
};

module.exports = isMentor;