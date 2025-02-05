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

const MemberReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/reports/members');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch member data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Member Activity
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member Name</TableCell>
                <TableCell align="right">Total Loans</TableCell>
                <TableCell align="right">Current Loans</TableCell>
                <TableCell align="right">Late Returns</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.memberStats.map((member) => (
                <TableRow key={member.member_id}>
                  <TableCell>
                    {member.first_name} {member.last_name}
                  </TableCell>
                  <TableCell align="right">{member.total_loans}</TableCell>
                  <TableCell align="right">{member.current_loans}</TableCell>
                  <TableCell align="right">{member.late_returns}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default MemberReport; 