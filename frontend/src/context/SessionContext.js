import { createContext, useState, useEffect, useContext } from "react";

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext)

export default function SessionProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setShowLoader(true), 200); // 200ms delay
        fetch('http://localhost:8000/api/session', { credentials: 'include' })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(
                data =>
                    setUser(data)
            )
            .catch(() => setUser(null))
            .finally(() => {
                clearTimeout(timeout);
                setLoading(false);
            });
    }, [])
    return (
        <SessionContext.Provider value={{ user, setUser }}>
            {loading &&  showLoader && <div>Loading...</div>}
            {children}
        </SessionContext.Provider>
    )
}

// (function GetSession() {
//   useEffect(() => {
//     fetch('/api/auth/session', { credentials: 'include' })
//       .then(res => {
//         if (!res.ok) throw new Error("Session expired");
//         return res.json();
//       })
//       .then(user => {
//         setUser(user); // { username, role }
//       })
//       .catch(() => {
//         setUser(null); // Force logout in UI
//         Navigate('/login');
//       });
//   }, []);
// })()