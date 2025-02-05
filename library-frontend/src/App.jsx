import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import theme from './theme';

import Layout from './components/Layout';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Register from './components/Register';
import BookList from './components/BookList';
import ConnectionTest from './components/ConnectionTest';
import ProtectedRoute from './components/ProtectedRoute';
import BorrowingSystem from './components/borrowing/BorrowingSystem';

import AdminRoutes from './routes/AdminRoutes';
import LibrarianRoutes from './routes/LibrarianRoutes';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/books" element={<BookList />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/system-status" element={<ConnectionTest />} />
                <Route 
                  path="/my-loans" 
                  element={
                    <ProtectedRoute>
                      <BorrowingSystem />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/librarian/*"
                  element={
                    <ProtectedRoute role="librarian">
                      <LibrarianRoutes />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 