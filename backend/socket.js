const {Server}=require("socket.io");
let io;

const initSocket=(server)=>{
    io=new Server(server,{cors:{ origin: "*"}});
    io.on("connection",(socket)=>{
        console.log("User connected");
        
        socket.on("join_room",(data)=>{
            const {userid,role}=data;
            console.log("Joined room:", "user_"+userid);
            socket.join("user_"+userid);
            if(role==="Mentor") 
            {
                socket.join("mentor_room");
                console.log("Mentor join mentor room");
            }
            if(role==="Student")
            { 
                socket.join("student_room");
                console.log("student join student room")
            }
            if(role==="Teacher") 
            {
                socket.join("teacher_room");
                console.log("Teacher join teacher room");
            }
            if(role==="Admin") 
            {    
                socket.join("admin_room");
                console.log("Admin Join admin room");
            }

        });
    });
    return io;
}

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports={initSocket,getIO};