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
    const [form, setForm] = useState({
        username: '',
        email: '',
        role: role ,
        password: '',
        confirm_password: '',
        bio: 'this is not null bio'
    });
    const [passwordErrors, setPasswordErrors] = useState([]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === "password") {
            const errors = [];
            if (value && value.length < 8) errors.push("Must be at least 8 characters.");
            if (value && /^\d+$/.test(value)) errors.push("Cannot be entirely numeric");
            const commonPasswords = ['12345678', 'password', 'qwerty', '11111111'];
            if (value && commonPasswords.includes(value.toLowerCase())) {
                errors.push("Password is too common");
            }
            setPasswordErrors(errors);
        }
    }

    const [error, setError] = useState(null);
    const submit = async (e) => {
        e.preventDefault(); // prevent form reload
        try {
            const response = await axios.post("http://localhost:8000/api/auth/register/", form, { withCredentials: true });
            // By default, browsers block sending cookies in cross-origin requests for security reasons.
            // so withCredential: false, will send no cookies, will save no cookies
            console.log(response?.data); // could be token, user data, etc.
            // Redirect to dashboard or save token
            // If you want to store session info or use HttpOnly cookies for JWT, you must enable withCredentials.

        } catch (error) {
            setError(error.response?.data?.message || "Unknown error - register")
            console.error("Registration failed", error.response?.data);
            // Show error to user
        }
    };
    return (
        <>
            <p>{role.charAt(0).toUpperCase() + role.slice(1)} Register here</p> {/* capitalize role lol */}
            <h1>Fill your details to register</h1>
            <form onSubmit={submit}>
                <label htmlFor="username">Username</label>
                <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
                <br />
                <label htmlFor="email">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
                <br />
                {/* <label htmlFor="fullName">Full Name</label> */}
                {/* <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} /> */}
                <br />
                {/* <label htmlFor="bio">Bio</label>
                <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} /> */}

                {/* <label htmlFor="avatar">Choose Avatar</label> <select id="avatar" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)}> <option value="avatar1.png">Avatar 1</option> <option value="avatar2.png">Avatar 2</option> </select> */}
                <br />
                <label htmlFor="password">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
                <ul style={{ color: "red", marginTop: "5px" }}>
                    {passwordErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                    ))}
                </ul>
                <br />
                <label htmlFor="password">Confirm Password</label>
                <input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} placeholder="Confirm Password" />
                <button type="submit">Submit</button>
                {error && <p>{error}</p>}
            </form>
        </>
    )
}