import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const LibrarianDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [openLoanDialog, setOpenLoanDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [memberId, setMemberId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks();
    fetchLoans();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/librarian/books');
      setBooks(response.data);
    } catch (error) {
      setError('Failed to fetch books');
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await api.get('/librarian/loans');
      setLoans(response.data);
    } catch (error) {
      setError('Failed to fetch loans');
    }
  };

  const handleLoan = async (e) => {
    e.preventDefault();
    try {
      await api.post('/librarian/loans', {
        memberId,
        bookId: selectedBook.book_id,
        dueDate
      });
      setOpenLoanDialog(false);
      fetchBooks();
      fetchLoans();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to process loan');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Available Books
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>ISBN</TableCell>
                  <TableCell>Available</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.book_id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>{book.available_copies}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        disabled={book.available_copies < 1}
                        onClick={() => {
                          setSelectedBook(book);
                          setOpenLoanDialog(true);
                        }}
                      >
                        Loan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Loans
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Book</TableCell>
                  <TableCell>Loan Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan.loan_id}>
                    <TableCell>{loan.member_name}</TableCell>
                    <TableCell>{loan.book_title}</TableCell>
                    <TableCell>{new Date(loan.loan_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(loan.due_date).toLocaleDateString()}</TableCell>
                    <TableCell>{loan.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openLoanDialog} onClose={() => setOpenLoanDialog(false)}>
        <DialogTitle>Process Loan</DialogTitle>
        <DialogContent>
          <TextField
            label="Member ID"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoanDialog(false)}>Cancel</Button>
          <Button onClick={handleLoan} variant="contained">
            Process Loan
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LibrarianDashboard; 