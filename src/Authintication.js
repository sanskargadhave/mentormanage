import socket from './socket';

import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext({
  id: null,
  name: null,
  email: null,
  role: "Guest",
  token:null,
  profilepic:null,
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }) {
  const [id, setid] = useState(() => localStorage.getItem("id"));
  const [name, setname] = useState(() => localStorage.getItem("name"));
  const [email, setemail] = useState(() => localStorage.getItem("email"));
  const [role, setrole] = useState(() => localStorage.getItem("role") || "Guest");
  const [token,settoken]=useState(()=>localStorage.getItem("token"));
  const [profilepic,setprofilepic]=useState(()=>localStorage.getItem("profilepic"));
  useEffect(() => {
    if (id && role && role !== "Guest") {

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);

      socket.emit("join_room", {
        userid: id,
        role: role
      });
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);   
    };
  }
  }, [id, role]);

  function login(userdata) {
    setid(userdata.id);
    setname(userdata.name);
    setemail(userdata.email);
    setrole(userdata.role);
    settoken(userdata.token);
    setprofilepic(userdata.profilepic)
    localStorage.setItem("id", userdata.id);
    localStorage.setItem("name", userdata.name);
    localStorage.setItem("email", userdata.email);
    localStorage.setItem("role", userdata.role);
    localStorage.setItem("token",userdata.token);
    localStorage.setItem("profilepic",userdata.profilepic);
    console.log(userdata.profilepic);
    socket.emit("join_room",{
      userid: userdata.id,
      role: userdata.role
    });
     console.log("Join room emitted:", userdata.id, userdata.role);
  }
 
  function logout() {
    setid(null);
    setname(null);
    setemail(null);
    setrole("Guest");
    settoken(null);
    setprofilepic(null);
    localStorage.clear();
    socket.disconnect();
  }

  return (
    <AuthContext.Provider value={{ id,name,email,role,token,profilepic,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
