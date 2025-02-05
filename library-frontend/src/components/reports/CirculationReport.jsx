import { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import api from '../../services/api';

const CirculationReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/reports/circulation');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch circulation data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  const chartData = {
    labels: data?.dailyStats.map(stat => stat.date) || [],
    datasets: [
      {
        label: 'Daily Loans',
        data: data?.dailyStats.map(stat => stat.loans_count) || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Daily Circulation
          </Typography>
          <Line data={chartData} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Most Popular Books
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell align="right">Borrow Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.popularBooks.map((book) => (
                <TableRow key={book.title}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell align="right">{book.borrow_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Category Statistics
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Loan Count</TableCell>
                <TableCell align="right">Unique Books</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.categoryStats.map((category) => (
                <TableRow key={category.category}>
                  <TableCell>{category.category}</TableCell>
                  <TableCell align="right">{category.loan_count}</TableCell>
                  <TableCell align="right">{category.unique_books}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CirculationReport; 