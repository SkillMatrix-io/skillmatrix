// import { Navigate } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import { useSession } from "../../context/SessionContext";
export default function Dashboard() {
    const { user } = useSession();
        switch (user?.role) {
            case 'student':
                return <StudentDashboard />;
            case 'teacher':
                return <TeacherDashboard />;
            case 'admin':
                return <AdminDashboard />;
            default:
                return <h3>Login to see!</h3>
        }
}