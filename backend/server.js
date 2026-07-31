require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http =require("http");
const {initSocket} =require("./socket");
const rateLimit =require("express-rate-limit");


const AdminRoutes=require("./Routes/AdminRoutes");
const AuthenticateRoutes=require("./Routes/AuthenticateRoutes");
const CommonRoutes=require("./Routes/CommonRoutes");
const MentorRoutes=require("./Routes/MentorRoutes");
const StudentRoutes=require("./Routes/StudentRoutes");
const TeacherRoutes=require("./Routes/TeacherRoutes");
const ProfileRoutes=require("./Routes/ProfileRoutes");
const AssignmentRoutes=require("./Routes/assignmentRoutes");

const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running");
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes."
  }
});

app.use("/api/admin",AdminRoutes);
app.use("/api/authenticate",loginLimiter,AuthenticateRoutes);
app.use("/api/common",CommonRoutes);
app.use("/api/mentor",MentorRoutes);
app.use("/api/student",StudentRoutes);
app.use("/api/teacher",TeacherRoutes);
app.use("/api/profile",ProfileRoutes);
app.use("/api/assignment",AssignmentRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});