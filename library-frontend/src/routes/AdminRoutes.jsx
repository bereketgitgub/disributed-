import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import BookManagement from '../components/admin/BookManagement';
import UserManagement from '../components/admin/UserManagement';

const AdminRoutes = () => {
  const { user, isAdmin } = useAuth();

  console.log('AdminRoutes check:', { user, isAdmin }); // Debug log

  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log('Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="books" element={<BookManagement />} />
      <Route path="users" element={<UserManagement />} />
    </Routes>
  );
};

export default AdminRoutes; 