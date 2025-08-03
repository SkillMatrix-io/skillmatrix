import { useState } from "react"
import axios from 'axios'
import './Login.css'

export default function Register() {
    const [userRole, setUserRole] = useState('student')

    return (
        <>

            <div className="login-container">
                <div className="switch-buttons">
                    <button
                        className={`switch-btn ${userRole === "student" ? "active" : ""}`}
                        onClick={() => setUserRole("student")}
                    >
                        Student Register
                    </button>
                    <button
                        className={`switch-btn ${userRole === "teacher" ? "active" : ""}`}
                        onClick={() => setUserRole("teacher")}
                    >
                        Teacher Register
                    </button>
                </div>

                <div className="form-container fade-in">
                    <UserRegister role={userRole} />
                </div>
            </div>
        </>
    )
}

export function UserRegister({ role }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png')

    const submit = async (e) => {
        e.preventDefault(); // prevent form reload
        try {
            const response = await axios.post("http://localhost:8000/api/auth/register/", {
                username,
                password,
                confirm_password: confirmPassword,
                email,
                full_name: fullName,
                bio,
                avatar_url: avatarUrl,
                role
            }, { withCredentials: true });
            // By default, browsers block sending cookies in cross-origin requests for security reasons.
            // so withCredential: false, will send no cookies, will save no cookies
            console.log(response.data); // could be token, user data, etc.
            // Redirect to dashboard or save token
            // If you want to store session info or use HttpOnly cookies for JWT, you must enable withCredentials.

        } catch (error) {
            setError(error.response?.data?.message || "Unknown error - register")
            console.error("Registration failed", error.response.data);
            // Show error to user
        }
    };
    return (
        <>
            <p>{role.charAt(0).toUpperCase() + role.slice(1)} Register here</p> {/* capitalize role lol */}
            <h1>Fill your details to register</h1>
            <form onSubmit={submit}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <br />
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <br />
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <br />
                <label htmlFor="bio">Bio</label>
                <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />

                {/* <label htmlFor="avatar">Choose Avatar</label> <select id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)}> <option value="avatar1.png">Avatar 1</option> <option value="avatar2.png">Avatar 2</option> </select> */}
                <br />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <br />
                <label htmlFor="password">Confirm Password</label>
                <input type="password" id="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

                <button type="submit">Submit</button>
                {error && <p>{error}</p>}
            </form>
        </>
    )
}