const XLSX = require("xlsx");

const getexcelsheet = async (req, resp) => {
    try {
        // 🔴 Important check
        if (!req.file) {
            return resp.status(400).json({ message: "No file uploaded" });
        }
        
        const wb = XLSX.read(req.file.buffer, { type: "buffer" });
        const sn = wb.SheetNames[0];
        const sheet = wb.Sheets[sn];
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log(data);

        resp.status(200).json({ data });

    } catch (err) {
        resp.status(500).json({ message: err.message });
    }
};

module.exports = { getexcelsheet};