import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import { useSession } from "../../context/SessionContext";

export default function Dashboard() {
    const { user } = useSession();
 const storedUser = localStorage.getItem("user")
    switch (user?.role || storedUser?.role) {
        case 'student':
            return (
                <div className="dashboard-wrapper">
                    <StudentDashboard />
                </div>
            );
        case 'teacher':
            return (
                <div className="dashboard-wrapper">
                    <TeacherDashboard />
                </div>
            );
        case 'admin':
            return (
                <div className="dashboard-wrapper">
                    <AdminDashboard />
                </div>
            );
        default:
            return (
                <div className="dashboard-wrapper" style={{textAlign: "center", marginTop: "60px"}}>
                    <h3 style={{fontSize: "1.6rem", fontWeight: "500", color: "var(--navbar-link)"}}>
                        Login to see!
                    </h3>
                </div>
            );
    }
}