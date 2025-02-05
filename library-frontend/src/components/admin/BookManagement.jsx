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
  MenuItem,
  Alert,
  IconButton,
  Box
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../services/api';

const BOOK_STATUS = ['AVAILABLE', 'ISSUED', 'RESERVED', 'MAINTENANCE'];

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publication_year: '',
    category_id: '',
    total_copies: '',
    description: ''
  });

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/admin/books');
      setBooks(response.data);
    } catch (error) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedBook) {
        await api.put(`/admin/books/${selectedBook.book_id}`, formData);
        setSuccess('Book updated successfully');
      } else {
        await api.post('/admin/books', formData);
        setSuccess('Book added successfully');
      }
      setOpenDialog(false);
      fetchBooks();
      resetForm();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save book');
      console.error('Error saving book:', error);
    }
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publication_year: book.publication_year,
      category_id: book.category_id,
      total_copies: book.total_copies,
      description: book.description
    });
    setOpenDialog(true);
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/admin/books/${bookId}`);
        setSuccess('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        setError('Failed to delete book');
        console.error('Error deleting book:', error);
      }
    }
  };

  const resetForm = () => {
    setSelectedBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publication_year: '',
      category_id: '',
      total_copies: '',
      description: ''
    });
    setError('');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Book Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
        >
          Add New Book
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Copies</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.book_id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.category_name}</TableCell>
                <TableCell>{book.available_copies}/{book.total_copies}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(book)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(book.book_id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedBook ? 'Edit Book' : 'Add New Book'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="author"
              label="Author"
              value={formData.author}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="isbn"
              label="ISBN"
              value={formData.isbn}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="publisher"
              label="Publisher"
              value={formData.publisher}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="publication_year"
              label="Publication Year"
              type="number"
              value={formData.publication_year}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              name="category_id"
              label="Category"
              value={formData.category_id}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            >
              {categories.map((category) => (
                <MenuItem key={category.category_id} value={category.category_id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="total_copies"
              label="Total Copies"
              type="number"
              value={formData.total_copies}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedBook ? 'Update' : 'Add'} Book
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookManagement; 