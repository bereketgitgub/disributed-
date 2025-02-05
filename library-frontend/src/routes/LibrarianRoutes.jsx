import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LibrarianDashboard from '../components/librarian/LibrarianDashboard';
import BookManagement from '../components/librarian/BookManagement';

const LibrarianRoutes = () => {
  const { user, isLibrarian } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isLibrarian) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route index element={<LibrarianDashboard />} />
      <Route path="books" element={<BookManagement />} />
    </Routes>
  );
};

export default LibrarianRoutes; 