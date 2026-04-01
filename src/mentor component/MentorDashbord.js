import { io } from "socket.io-client";
import { useEffect } from "react";
function MentorDashboardContent()
{
    const socket = io("https://sangolacollage.onrender.com");
    useEffect(() => {
        socket.on("studentAdded", (data) => {
            alert(`New student added: ${data.name}`);
        });

        return () => socket.off("studentAdded");
    }, []);
    return (
        <div>
            
        </div>
    );
}
export {MentorDashboardContent};