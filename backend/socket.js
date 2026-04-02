const {Server}=require("socket.io");
let io;

const initSocket=(server)=>{
    io=new Server(server,{cors:{ origin: "*"}});
    io.on("connection",(socket)=>{
        console.log("User connected");
        socket.on("join_room",(data)=>{
            const {userid,role}=data;
            socket.join("user_"+userid);
            if(role==="Mentor") socket.join("mentor_room");
            if(role==="Student") socket.join("student_room");
            if(role==="Teacher") socket.join("teacher_room");
            if(role==="Admin") socket.join("admin_room");

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