import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box
} from '@mui/material';
import api from '../../services/api';

const BorrowingSystem = () => {
  const [loans, setLoans] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get('/loans');
      setLoans(response.data);
    } catch (error) {
      setError('Failed to fetch loans');
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await api.post('/loans/borrow', { bookId });
      fetchLoans();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to borrow book');
    }
  };

  const handleReturn = async (loanId) => {
    try {
      await api.post('/loans/return', { loanId });
      fetchLoans();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to return book');
    }
  };

  const handleRenew = async (loanId) => {
    try {
      await api.post('/loans/renew', { loanId });
      fetchLoans();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to renew loan');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Loans
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book Title</TableCell>
              <TableCell>Borrow Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan) => (
              <TableRow key={loan.loan_id}>
                <TableCell>{loan.book_title}</TableCell>
                <TableCell>
                  {new Date(loan.loan_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(loan.due_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{loan.status}</TableCell>
                <TableCell>
                  {loan.status === 'BORROWED' && (
                    <>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleReturn(loan.loan_id)}
                        sx={{ mr: 1 }}
                      >
                        Return
                      </Button>
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => handleRenew(loan.loan_id)}
                      >
                        Renew
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default BorrowingSystem; 