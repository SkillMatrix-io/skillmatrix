import { useState, useEffect } from "react"
import axios from 'axios'
import './Login.css'
import { useNavigate } from 'react-router-dom'

const baseURL = `${process.env.REACT_APP_API_URL}/api`;

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
    const [response, setResponse] = useState("")
    const navigate = useNavigate()

    // avatar selection
    const [avatars, setAvatars] = useState([]);

    const [form, setForm] = useState({
        username: '',
        email: '',
        role: role,
        password: '',
        confirm_password: '',
        bio: '',
        avatar: 1
    });

    const [passwordErrors, setPasswordErrors] = useState([]);
    useEffect(() => {
        setForm(prevForm => ({
            ...prevForm,
            role: role
        }))
    }, [role])

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
            const response = await axios.post(`${baseURL}/auth/register/`, form, { withCredentials: true });
            // By default, browsers block sending cookies in cross-origin requests for security reasons.
            // so withCredential: false, will send no cookies, will save no cookies
            setResponse(response.data)
            console.log(`Sent userdata: ${role}`)
            console.log(response?.data);  // could be token, user data, etc.
            // Redirect to dashboard or save token
            localStorage.setItem("user", JSON.stringify(response.data));
            navigate(`/dashboard/${role}`)

            // If you want to store session info or use HttpOnly cookies for JWT, you must enable withCredentials.

        } catch (error) {
            setError(error.response?.data?.message || "Unknown error - register")
            console.error("Registration failed", error.response?.data);
            // Show error to user
        }
    };

    useEffect(() => {
        const allAvatars = Array.from({ length: 24 }, (_, i) => i + 1)

        const random10 = allAvatars.sort(() => Math.random() - 0.5)
            .slice(0, 10)

        setAvatars(random10)
    }, [])

    const handleSelect = (id) => {
        setForm(prevForm => ({
            ...prevForm,
            avatar: prevForm.avatar===id? null:id
        }));
    };

    return (
        <>
            {/* <p>{role.charAt(0).toUpperCase() + role.slice(1)} Register here</p> capitalize role lol */}
            <h1>Fill your details to register</h1>
            {response && <p>response</p>}
            <form onSubmit={submit}>
                <label htmlFor="username">Username</label>
                <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
                <br />
                <label htmlFor="email">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
                <br />
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
                <div className="avatar-grid">
                    {avatars.map((id) => (
                        <div
                            key={id}
                            className={`avatar-item ${form.avatar === id ? "selected" : ""}`}
                            onClick={() => handleSelect(id)}
                        >
                            <img src={`/avatar/${id}.png`} alt={`Avatar ${id}`} />
                        </div>
                    ))}
                </div>
                <button type="submit">Submit</button>
                {error && <p>{error}</p>}
            </form>
        </>
    )
}