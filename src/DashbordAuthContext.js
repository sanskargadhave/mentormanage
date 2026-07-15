import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./Authintication";
import axiosInstance from "./axiosInstance";

export const DashbordContext = createContext();

export function DashbordProvider({ children }) {

    const [totalStudent, setTotalStudent] = useState(0);
    const [totalMentor, setTotalMentor] = useState(0);
    const [facultySpotlight, setFacultySpotlight] = useState([]);

    const { token } = useContext(AuthContext);

    useEffect(() => {

        async function getContextData() {

            try {
                const resp = await axiosInstance.get("/common/get-spotlight-dashboard");

                setTotalStudent(resp.data.totalStudents);
                setTotalMentor(resp.data.totalMentor);
                setFacultySpotlight(resp.data.spotlight);

            } catch (err) {
                console.log(err);
            }
        }
        getContextData();

    }, [token]);

    return (
        <DashbordContext.Provider
            value={{
                totalStudent,
                totalMentor,
                facultySpotlight
            }}
        >
            {children}
        </DashbordContext.Provider>
    );
}