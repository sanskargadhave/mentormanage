require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http =require("http");
const {initSocket} =require("./socket");

const GetDataRoute = require("./Routes/GetDataRoute");
const StoreDataRoute =require("./Routes/StoreDataRoute");
const UpdateDataRoute =require("./Routes/UpdateDataRoute");

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

app.use("/",GetDataRoute);
app.use("/",StoreDataRoute);
app.use("/",UpdateDataRoute);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});