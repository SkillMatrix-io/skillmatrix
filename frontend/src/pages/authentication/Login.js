import { useState } from "react"
import axios from 'axios'
import './Login.css'
import { useNavigate } from 'react-router-dom'

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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    const submit = async (e) => {
        e.preventDefault(); // prevent form reload
        try {
            const response = await axios.post(`${baseURL}/auth/login/`, {
                username,
                password,
                role
            }, { withCredentials: true });
            // By default, browsers block sending cookies in cross-origin requests for security reasons.
            // so withCredential: false, will send no cookies, will save no cookies
            console.log(response.data);
            console.log(`Sent userdata: ${username} - ${role}`)
            localStorage.setItem("user", JSON.stringify(response.data));
            // could be token, user data, etc.
            navigate(`/dashboard/${role}`)
            // Redirect to dashboard or save token
            // If you want to store session info or use HttpOnly cookies for JWT, you must enable withCredentials.

        } catch (error) {
            setError(error.response?.data?.message || "Unknown error - LoginDotJs")
            console.error("Login failed", error.response.data);
            // Show error to user
        }
    };
    return (
        <>
            {/* <p>{role.charAt(0).toUpperCase() + role.slice(1)} Login here</p> capitalize role lol */}
            <h1>Fill your details to login</h1>
            <form onSubmit={submit}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button type="submit">Submit</button>
                {error && <p>{error}</p>}
            </form>
        </>
    )
}
export function AdminLogin() {
    return (
        <p class="center">Are u an admin?
            Login here
        </p>
    )
}