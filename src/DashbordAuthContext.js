import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./Authintication";
import axios from "axios";

export const DashbordContext = createContext();

export function DashbordProvider({ children }) {

    const [totalStudent, setTotalStudent] = useState(0);
    const [totalMentor, setTotalMentor] = useState(0);
    const [facultySpotlight, setFacultySpotlight] = useState([]);

    const { token } = useContext(AuthContext);

    useEffect(() => {

        async function getContextData() {

            try {
                const resp = await axios.get(
                    "https://sangolacollage.onrender.com/api/common/get-spotlight-dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setTotalStudent(resp.data.totalStudents);
                setTotalMentor(resp.data.totalMentor);
                setFacultySpotlight(resp.data.spotlight);

            } catch (err) {

                console.log(err);
                alert(err.response?.data?.message || err.message);

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