import "../admin component/admin.css";
import axios from "axios";
import { useContext,useEffect,useState } from "react";
import { AuthContext } from '../Authintication';

function StudentDashbord() {
    const {id,token}=useContext(AuthContext);
    const [applications,setapplications]=useState([]);

    useEffect(()=>{
        if(!token || !id) return ;
        async function getapplication(){
            try{
                const resp= await axios.get(`https://sangolacollage.onrender.com/api/student/get-student-applications/${id}`);
                setapplications(resp.data.applications);
                console.log(resp.data.applications);
            }
            catch(err)
            {
                alert(err.message);
            }
        }
        getapplication();
    },[token,id]);

    return (

        <div className="admin-content">

            <h4>Hello This is Student Dashboard</h4>

        </div>
    );
}

export default StudentDashbord;