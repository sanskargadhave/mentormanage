import { useEffect,useState} from "react";
import  socket  from "../socket";

function MentorDashboardContent() {

  const [notification,setnotification]=useState([]);
  useEffect(()=>{
      const handlenotification=(data)=>{
        console.log(data);   
        setnotification(prev => [data, ...prev]);
      };
      socket.on("notification", handlenotification);

      return()=>{
        socket.off("notification",handlenotification);
      }
  },[]);

  return (
    <div>
      {notification.map((n,index)=>(
        <div key={index} className="notification-card">
          <p>{n.message}</p>
          <p>Name: {n.student.name}</p>
          <p>Roll: {n.student.rollno}</p>
          <p>Email: {n.student.email}</p>
        </div>
      ))}
    </div>
  );
}

export { MentorDashboardContent };