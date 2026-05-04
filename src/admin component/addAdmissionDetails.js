import { useState } from "react";
import "./admin.css";
import axios from "axios";
import { GiveError } from "../WarningOrSucess";
function AddAdmissionDetails() {
    const [file, setFile] = useState(null);
    const token = localStorage.getItem("token");
    const [showerror,setshowerror]=useState(false);
    const [message,setmessage]=useState("");
    const sendFile = async () => {
        if (!file) {
            return alert("Please select file first");
        }

        const formdata = new FormData();
        formdata.append("file", file);
        try{
            
            const res = await axios.post("https://sangolacollage.onrender.com/api/mentor/store-excel-data",
                formdata,
                {   headers: {
                        Authorization: `Bearer ${token}`, 
                        "Content-Type": "multipart/form-data"
                    }
                }


            );
            setmessage(res.data.message);
            setshowerror(true);
        }
        catch(err)
        {
            setmessage(err.response?.data?.message || "Server Error");
            setshowerror(true);
        }
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
            {showerror && (
                <GiveError show={showerror} message={message} duration={10000} onClose={()=>setshowerror(false)}/>
            )}
            <button className="upload-btn" onClick={sendFile}>
                Upload File
            </button>
            <hr/>
            
        </div>
    );
}

export default AddAdmissionDetails;