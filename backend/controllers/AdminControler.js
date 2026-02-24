const readadmin = require("../model/adminSchema");
const bcrypt = require("bcryptjs");
//  /api/admin-login  URL POST 
const AdminLogin=async (req, resp) => {
  try {
    const { emailid, password } = req.body;

    const admin = await readadmin.findOne({ emailid }); 
    if (!admin) {
      return resp.status(404).json({ message: "Admin Not Found" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return resp.status(401).json({ message: "Password Doesn't Match"});
    }

    resp.status(200).json({ message: "Login Success.... Welcome Admin",admin});

  } catch (err) {
    console.error(err);
    resp.status(500).json({ message: "Server Error" });
  }
};

module.exports={AdminLogin};