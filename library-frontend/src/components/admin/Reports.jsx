import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import { wsService } from '../../services/websocket';
import api from '../../services/api';

const Reports = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeLoans: 0,
    overdueLoans: 0,
    totalUsers: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInitialData();
    
    // Subscribe to real-time updates
    const unsubscribeStats = wsService.subscribe('stats_update', (data) => {
      setStats(prev => ({ ...prev, ...data }));
    });

    const unsubscribeLoans = wsService.subscribe('loan_update', (data) => {
      setStats(prev => ({
        ...prev,
        recentActivity: [data, ...prev.recentActivity].slice(0, 10)
      }));
    });

    return () => {
      unsubscribeStats();
      unsubscribeLoans();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes] = await Promise.all([
        api.get('/admin/reports/stats'),
        api.get('/admin/reports/recent-activity')
      ]);
      
      setStats({
        ...statsRes.data,
        recentActivity: activityRes.data
      });
    } catch (err) {
      setError('Failed to fetch report data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Live Library Reports
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <Typography variant="h4">{stats.totalBooks}</Typography>
            <Typography color="textSecondary">Total Books</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <Typography variant="h4">{stats.activeLoans}</Typography>
            <Typography color="textSecondary">Active Loans</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Typography variant="h4">{stats.overdueLoans}</Typography>
            <Typography color="textSecondary">Overdue Loans</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f3e5f5' }}>
            <Typography variant="h4">{stats.totalUsers}</Typography>
            <Typography color="textSecondary">Total Users</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Live Activity Feed
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.recentActivity.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  {new Date(activity.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.details}</TableCell>
                <TableCell>{activity.user}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default Reports;