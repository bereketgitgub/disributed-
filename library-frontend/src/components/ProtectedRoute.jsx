import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, isAdmin, isLibrarian } = useAuth();

  console.log('ProtectedRoute check:', { user, role, isAdmin, isLibrarian }); // Debug log

  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin') {
    if (!isAdmin) {
      console.log('Not admin, redirecting to home');
      return <Navigate to="/" replace />;
    }
  }

  if (role === 'librarian') {
    if (!isLibrarian && !isAdmin) {
      console.log('Not librarian or admin, redirecting to home');
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 