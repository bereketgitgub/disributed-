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
  TextField,
  Box,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import api from '../../services/api';

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/librarian/books');
      setBooks(response.data);
    } catch (error) {
      setError('Failed to fetch books');
    }
  };

  const handleReturn = async (bookId) => {
    try {
      await api.post(`/librarian/books/${bookId}/return`);
      setSuccess('Book returned successfully');
      fetchBooks();
    } catch (error) {
      setError('Failed to process return');
    }
  };

  const handleCheckout = async (bookId) => {
    try {
      await api.post(`/librarian/books/${bookId}/checkout`);
      setSuccess('Book checked out successfully');
      fetchBooks();
    } catch (error) {
      setError('Failed to process checkout');
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Book Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map((book) => (
              <TableRow key={book.book_id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.status}</TableCell>
                <TableCell>
                  {book.status === 'AVAILABLE' ? (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleCheckout(book.book_id)}
                      startIcon={<CheckCircleIcon />}
                    >
                      Check Out
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleReturn(book.book_id)}
                      startIcon={<CancelIcon />}
                    >
                      Return
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

export default BookManagement;