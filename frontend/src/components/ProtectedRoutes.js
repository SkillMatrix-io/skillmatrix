import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('user')
    if (!user) {
        return <Navigate to="/auth/login" />;
    }
    return children;
};

export const PublicRoutes = ({ children }) => {
    const user = localStorage.getItem('user')
    if (!user) {
        return children
    }
}

export default ProtectedRoute;