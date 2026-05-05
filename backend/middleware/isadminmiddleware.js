const isAdmin = (req, res, next) => {
    if (req.user?.role !== "Admin") {
        console.log("Access denied. Admin only");
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
};

module.exports = isAdmin;