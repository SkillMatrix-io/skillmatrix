import { Link } from "react-router-dom";

export default function TeacherDashboard() {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    return (
        <div>
            <h1>Hi, {storedUser?.username} 👋</h1>
            <p>
                <Link to="/create_edit">Create/Edit Course</Link>
            </p>
        </div>
    );
}
