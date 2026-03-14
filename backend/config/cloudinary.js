const cloudinary=require("cloudinary").v2;
cloudinary.config({
    clouse_name:process.env.CLOUD_NAME,
    api_key:process.key.API_KEY,
    api_secret_key:process.env.API_SECRET,
});
module.exports=cloudinary;