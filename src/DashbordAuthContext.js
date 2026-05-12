import { createContext,useState,useEffect,useContext } from "react";
import {AuthContext} from "./Authintication";

export const DashbordContext=createContext();

export function DashbordProvider({children }){
    const [totalStudent,setTotalStudent]=useState(0);
    const [totalMentor,setTotalMentor]=useState(0);
    const {token}=useContext(AuthContext);

    useEffect(()=>{
    
    fetch("https://sangolacollage.onrender.com/api/common/User-Counts",{
             headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
    .then(res=>res.json())
    .then(data=>{setTotalStudent(data.totalStudents);setTotalMentor(data.totalMentor)})
    },[token]);
    return(
        <DashbordContext.Provider value={{totalStudent,totalMentor}}>
            {children}
        </DashbordContext.Provider>


    )
}