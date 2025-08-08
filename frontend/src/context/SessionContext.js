import { createContext, useState, useEffect, useContext, useRef } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SessionContext = createContext();
const baseURL = `${process.env.REACT_APP_API_URL}/api`;

export const useSession = () => useContext(SessionContext)

export default function SessionProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const toastIdRef = useRef(null); 

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
            .then(data => setUser(data))
            .catch(() => setUser(null))
            .finally(() => {
                setLoading(false);
            });

    }, []);

    useEffect(() => {
        if (loading && !toast.isActive(toastIdRef.current)) {
            toastIdRef.current = toast.loading('Loading...');
        } else if (!loading && toastIdRef.current) {
            toast.dismiss(toastIdRef.current);
            toastIdRef.current = null;
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
