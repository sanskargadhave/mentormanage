const multer=require("multer");
const storage = multer.memoryStorage();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

const uploadProfile = async (req, res ,next) => {
    try {
        const file = req.file;
        console.log("at uploadProfile ",file);
       if (!file) {
            req.body.imageurl   = "";
            return next();
        }
       const fileName =
`${Date.now()}-${Math.random()}-${file.originalname}`;

        const { error } = await supabase.storage
            .from("Profile Picture")
            .upload(
                fileName,
                file.buffer,
                {
                    contentType: file.mimetype
                }
            );

        if (error) {
            console.log(error)
            return res.status(400).json(error);

        }

        const { data } = supabase.storage
            .from("Profile Picture")
            .getPublicUrl(fileName);

        req.body.imageurl=data.publicUrl;
        console.log(req.body.imageurl);
        next();
    } catch (err) {
         console.log(err)
        res.status(500).json(err);
    }
    
};
module.exports={uploadProfile,upload};