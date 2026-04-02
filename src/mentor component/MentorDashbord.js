import { useEffect } from "react";
import { socket } from "../socket";

function MentorDashboardContent() {

  useEffect(() => {
    socket.on("connect",()=>{
      console.log("Socket connected:", socket.id);
    });

    socket.on("StudentAdded",(data) => {
      console.log("Notification received:", data);
      alert(`New student added: ${data.name}`);
    });

    return () => {
      socket.off("StudentAdded");
    };

  }, []);

  return (
    <div>
      Mentor Dashboard
    </div>
  );
}

export { MentorDashboardContent };