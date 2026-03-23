import { useState } from "react";
import "./admin.css";
import axios from "axios"
function AddAdmissionDetails() {
    const [file, setFile] = useState(null);
    const [excelData,setexceldata]=useState([]);
    const sendFile = async () => {
        if (!file) {
            return alert("Please select file first");
        }

        const formdata = new FormData();
        formdata.append("file", file);

        const res = await axios.post("http://localhost:5000/api/store-excel-data",formdata)

        
        setexceldata(res.data);
        console.log(excelData);

    };

    return (
        <div className="admin-content upload-container">
            
            <div className="upload-box">
                <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files[0])}/>
                <p>Click or select Only Excel file</p>
                <b>Incorrect File May Data Incorrect</b>
                <p><span class="badge text-bg-danger">make Sure Your File Contain Only Two Column </span></p>
                <p><span class="badge text-bg-info">RecieptNo</span>--------------<span class="badge text-bg-info">Name</span></p>
            </div>

            {file && (
                <div className="file-preview">
                    Selected: {file.name}
                </div>
            )}

            <button className="upload-btn" onClick={sendFile}>
                Upload File
            </button>
            <hr/>
            
        </div>
    );
}

export default AddAdmissionDetails;