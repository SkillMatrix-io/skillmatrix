import { useState, useEffect } from "react"
import axios from 'axios'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import { showToast } from "../../components/functional/Toast"

const baseURL = `${process.env.REACT_APP_API_URL}/api`;

export default function Login() {
    const [userRole, setUserRole] = useState('student')

    return (
        <>

            <div className="login-container">
                <div className="switch-buttons">
                    <button
                        className={`switch-btn ${userRole === "student" ? "active" : ""}`}
                        onClick={() => setUserRole("student")}
                    >
                        Student Login 
                    </button>
                    <button
                        className={`switch-btn ${userRole === "teacher" ? "active" : ""}`}
                        onClick={() => setUserRole("teacher")}
                    >
                        Teacher Login
                    </button>
                </div>

                <div className="form-container fade-in">
                    <UserLogin role={userRole} />
                </div>
            </div>
            <AdminLogin />
        </>
    )
}

export function UserLogin({ role }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [response,setResponse] = useState(null)
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${baseURL}/auth/login/`,
                { username, password, role },
                { withCredentials: true }
            );
            setResponse(response?.data.message)
            localStorage.setItem("user", JSON.stringify(response.data));
            navigate(`/dashboard/${role}`);
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
            console.error("Login failed", error.response?.data.message);
        }
    };

    useEffect(() => {
        if (error) {
            showToast.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (response) {
            showToast.success(response);
        }
    }, [response]);

    return (
        <>
            <h1>Fill your details to login</h1>
            <form onSubmit={submit}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Submit</button>
            </form>
        </>
    );
}

export function AdminLogin() {
    return (
        <p className="center">Are u an admin?
            Login here
        </p>
    )
}