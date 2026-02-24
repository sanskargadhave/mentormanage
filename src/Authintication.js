import { createContext, useState } from "react";

export const AuthContext = createContext({
  id: null,
  name: null,
  email: null,
  role: "Guest",
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }) {
  const [id, setid] = useState(() => localStorage.getItem("id"));
  const [name, setname] = useState(() => localStorage.getItem("name"));
  const [email, setemail] = useState(() => localStorage.getItem("email"));
  const [role, setrole] = useState(() => localStorage.getItem("role") || "Guest");

  function login(userdata) {
    setid(userdata.id);
    setname(userdata.name);
    setemail(userdata.email);
    setrole(userdata.role);
    localStorage.setItem("id", userdata.id);
    localStorage.setItem("name", userdata.name);
    localStorage.setItem("email", userdata.email);
    localStorage.setItem("role", userdata.role);
  }

  function logout() {
    setid(null);
    setname(null);
    setemail(null);
    setrole("Guest");
     localStorage.clear();
  }

  return (
    <AuthContext.Provider value={{ id,name,email,role,login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
