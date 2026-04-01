const {storeadmissionDetails}=require("../model/admissionScema");

const getexcelsheet = async (req, resp) => {
    try {
        const data = req.exceldata;
        
        
        const validData = data.filter(row =>
            row.ReceiptNo && row.name
        );

     
        if(validData.length === 0)
        {
            return resp.status(400).json({message:"Excel contains invalid data"});
        }
        
        await storeadmissionDetails.insertMany(validData,{ordered:false});
        
        resp.status(200).json({ message: "Data inserted successfully"});

    } catch (err) {
    
        resp.status(500).json({ message: err.message });
    }
};
module.exports = { getexcelsheet};