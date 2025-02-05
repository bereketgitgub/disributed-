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
  Alert,
  CircularProgress
} from '@mui/material';
import { wsService } from '../services/websocket';
import api from '../services/api';

const UserLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLoans();
    
    // Subscribe to real-time loan updates
    const unsubscribe = wsService.subscribe('user_loan_update', (data) => {
      setLoans(prev => {
        const index = prev.findIndex(loan => loan.loan_id === data.loan_id);
        if (index >= 0) {
          const newLoans = [...prev];
          newLoans[index] = data;
          return newLoans;
        }
        return [data, ...prev];
      });
    });

    return () => unsubscribe();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get('/loans/my-loans');
      setLoans(response.data);
    } catch (err) {
      setError('Failed to fetch your loans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (loanId) => {
    try {
      await api.post(`/loans/${loanId}/renew`);
      // WebSocket will handle the update
    } catch (err) {
      setError('Failed to renew loan');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        My Loans
      </Typography>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book</TableCell>
              <TableCell>Borrowed Date</TableCell>
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
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleRenew(loan.loan_id)}
                    >
                      Renew
                    </Button>
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

export default UserLoans; 