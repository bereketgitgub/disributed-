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
import { Bar } from 'react-chartjs-2';
import api from '../../services/api';

const FinancialReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/reports/financial');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch financial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  const chartData = {
    labels: data?.feesSummary.map(fee => fee.month) || [],
    datasets: [
      {
        label: 'Collected Amount',
        data: data?.feesSummary.map(fee => fee.collected_amount) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Pending Amount',
        data: data?.feesSummary.map(fee => fee.pending_amount) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Fees Summary
          </Typography>
          <Bar data={chartData} />
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Outstanding Fees by Member
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member Name</TableCell>
                <TableCell align="right">Number of Fees</TableCell>
                <TableCell align="right">Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.outstandingFees.map((member) => (
                <TableRow key={member.member_id}>
                  <TableCell>
                    {member.first_name} {member.last_name}
                  </TableCell>
                  <TableCell align="right">{member.fee_count}</TableCell>
                  <TableCell align="right">
                    ${member.total_amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FinancialReport; 