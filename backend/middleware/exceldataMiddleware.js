const multer=require("multer");
const storage = multer.memoryStorage();
const uplode=multer({storage:storage});
const XLSX = require("xlsx");

const iscorrectdata =(req,resp,next)=>{
    if (!req.file) {
        return resp.status(400).json({ message: "No file uploaded" });
    }    
        const wb = XLSX.read(req.file.buffer, { type: "buffer" });
        const sn = wb.SheetNames[0];
        const sheet = wb.Sheets[sn];
        const range=XLSX.utils.decode_range(sheet['!ref'])
        const data = XLSX.utils.sheet_to_json(sheet,{defval:""});
        const columnCount = range.e.c - range.s.c + 1;
        if(columnCount != 2)
        {
            console.log("Make sure YOu Have Only Two Columns [ReceiptNo And name]   ");
        }
        
        const headerRow=range.s.r;
        const receiptCellAddress = XLSX.utils.encode_cell({ r: headerRow, c: range.s.c });
        const nameCellAddress = XLSX.utils.encode_cell({ r: headerRow, c: range.s.c + 1 });
        const receiptHeader = sheet[receiptCellAddress]?.v;
        const nameHeader = sheet[nameCellAddress]?.v;

        const formattedData = data.map((row) => ({
            ReceiptNo: row[receiptHeader],
            name: row[nameHeader]
        }));
        
        req.exceldata=formattedData;
        
        next();
    
}
module.exports={uplode,iscorrectdata};








