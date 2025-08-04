// import { Navigate } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";
import TeacherDashboard from "./TeacherDashboard";
import ErrorPage from '../ErrorPage'

import { Navigate } from 'react-router-dom';
import { useSession } from "../../context/SessionContext";
// import ErrorPage from "../ErrorPage";
// all imports r usefull later on

export default function Dashboard() {
    // const user = JSON.parse(localStorage.getItem("user"));

    const { user } = useSession();

    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }
    switch (user.role) {
        case 'student':
            return <StudentDashboard />;
        case 'teacher':
            return <TeacherDashboard />;
        case 'admin':
            return <AdminDashboard />;
        default:
            return <ErrorPage />
    }
}
// so maybe this page points to student, admin, and teachers dashboard based on whos login

// localStorage.setItem("user","student")
// localStorage.setItem("user","teacher")
// localStorage.setItem("user","admin")
// localStorage.setItem("user", JSON.stringify({ role: "student", name: "Vineet" }));


// If you want role - based URLs, you can also have:

// jsx
// Copy
// Edit
//     < Route path = "/dashboard/student" element = {< StudentDashboard />} />
//         < Route path = "/dashboard/admin" element = {< AdminDashboard />} />
//             < Route path = "/dashboard/teacher" element = {< TeacherDashboard />} />
// Then use navigate('/dashboard/' + res.data.role) after login.

// 🔁 Downside: It creates redundancy.If user visits / dashboard / student directly without being logged in, you’ll still need protection in each dashboard or at route level.

// ✅ 4. Protect routes with a ProtectedRoute wrapper
// Instead of guarding inside Dashboard, make a component:

// jsx
// Copy
// Edit
// const ProtectedRoute = ({ children }) => {
//     const { user } = useSession();
//     if (!user) return <Navigate to="/auth/login" replace />;
//     return children;
// };
// Use it like this:

// jsx
// Copy
// Edit
//     < Route path = "/dashboard" element = {
//   < ProtectedRoute >
//         <Dashboard />
//   </ProtectedRoute >
// } />