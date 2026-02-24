require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");


const GetDataRoute = require("./Routes/GetDataRoute");
const StoreDataRoute =require("./Routes/StoreDataRoute");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/",GetDataRoute);
app.use("/",StoreDataRoute);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});