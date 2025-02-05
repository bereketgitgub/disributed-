import { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import api from '../../services/api';

const InventoryReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/reports/inventory');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch inventory data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  const chartData = {
    labels: data?.categoryDistribution.map(cat => cat.category) || [],
    datasets: [
      {
        data: data?.categoryDistribution.map(cat => cat.total_books) || [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Category Distribution
          </Typography>
          <Doughnut data={chartData} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Low Stock Alert
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="right">Available</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.lowAvailability.map((book) => (
                <TableRow key={book.title}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell align="right">{book.available_copies}</TableCell>
                  <TableCell align="right">{book.total_copies}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default InventoryReport; 