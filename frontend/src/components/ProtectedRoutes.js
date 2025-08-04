import { Navigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useSession();

    if (!user) {
        return <Navigate to="/auth/login" />;
    }

    return children;
};

export default ProtectedRoute;

// ✅ Bonus: Role - Based Routes ?
//     If you want to protect / teacher - dashboard or / admin based on role:

// Update ProtectedRoute like this:

// jsx
// Copy
// Edit
// const ProtectedRoute = ({ children, allowedRoles }) => {
//     const { user } = useSession();

//     if (!user) return <Navigate to="/auth/login" />;
//     if (allowedRoles && !allowedRoles.includes(user.role)) {
//         return <Navigate to="/" />;
//     }

//     return children;
// };
//<Route
// path="/admin"
//element={
// <ProtectedRoute allowedRoles={['admin']}>
//      <AdminDashboard />
//    </ProtectedRoute>
//  }
///>