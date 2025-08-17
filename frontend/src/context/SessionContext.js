import { createContext, useState, useEffect, useContext } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from "../components/functional/Toast";
import { toast } from "react-toastify";

const SessionContext = createContext();
const baseURL = `${process.env.REACT_APP_API_URL}/api`;

export const useSession = () => useContext(SessionContext)

export default function SessionProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Invalid user in localStorage");
            }
        }

        fetch(`${baseURL}/session`, { credentials: 'include' })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setUser(data) && localStorage.setItem("user",data))
            .catch(() => {
                setUser(null)
                localStorage.setItem("user",null)
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    useEffect(() => {
        if (loading) {
            showToast.loading("Loading session...");
        } else {
            setTimeout(()=>{
                toast.dismiss("global-loader");
            },1000)
        }
    }, [loading]);

    useEffect(() => {
        if (user) {
            const currentStored = localStorage.getItem("user");
            const parsed = currentStored && JSON.parse(currentStored);
            if (!parsed || parsed.username !== user.username) {
                localStorage.setItem("user", JSON.stringify(user));
            }
        }
    }, [user]);

    return (
        <SessionContext.Provider value={{ user, setUser }}>
            {children}
        </SessionContext.Provider>
    );
}
