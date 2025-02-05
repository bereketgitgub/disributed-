import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Button,
  Divider,
  useTheme,
  Tab,
  Tabs
} from '@mui/material';
import {
  TrendingUp,
  LibraryBooks,
  People,
  Warning,
  ArrowForward,
  Book,
  PersonAdd,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import UserManagement from './admin/UserManagement';
import BookManagement from './admin/BookManagement';
import ReportsDashboard from './reports/ReportsDashboard';

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Books',
      value: stats?.totalBooks || 0,
      icon: <LibraryBooks />,
      color: '#4CAF50', // Green
      bgGradient: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)'
    },
    {
      title: 'Active Loans',
      value: stats?.activeLoans || 0,
      icon: <TrendingUp />,
      color: '#2196F3', // Blue
      bgGradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)'
    },
    {
      title: 'Members',
      value: stats?.totalMembers || 0,
      icon: <People />,
      color: '#9C27B0', // Purple
      bgGradient: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)'
    },
    {
      title: 'Overdue Loans',
      value: stats?.overdueLoans || 0,
      icon: <Warning />,
      color: '#F44336', // Red
      bgGradient: 'linear-gradient(135deg, #F44336 0%, #E57373 100%)'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Book',
      icon: <Book sx={{ fontSize: 40 }} />,
      description: 'Add a new book to the library catalog',
      action: () => navigate('/admin/books/add'),
      color: '#FF9800', // Orange
      bgGradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)'
    },
    {
      title: 'Register Member',
      icon: <PersonAdd sx={{ fontSize: 40 }} />,
      description: 'Register a new library member',
      action: () => navigate('/admin/members/add'),
      color: '#00BCD4', // Cyan
      bgGradient: 'linear-gradient(135deg, #00BCD4 0%, #4DD0E1 100%)'
    }
  ];

  const chartData = {
    labels: stats?.monthlyStats.map(stat => stat.month) || [],
    datasets: [
      {
        label: 'Monthly Loans',
        data: stats?.monthlyStats.map(stat => stat.borrowCount) || [],
        fill: false,
        borderColor: theme.palette.primary.main,
        tension: 0.4,
      }
    ]
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const renderContent = () => {
    switch (currentTab) {
      case 0:
        return <BookManagement />;
      case 1:
        return <UserManagement />;
      case 2:
        return <ReportsDashboard />;
      default:
        return <BookManagement />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of library operations and statistics
        </Typography>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Books" />
          <Tab label="Users" />
          <Tab label="Reports" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {renderContent()}
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action) => (
          <Grid item xs={12} sm={6} key={action.title}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                background: action.bgGradient,
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}
              onClick={action.action}
            >
              <CardContent sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                p: 3 
              }}>
                {action.icon}
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {action.title}
                  </Typography>
                  <Typography variant="body2">
                    {action.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper 
              sx={{ 
                p: 3,
                background: stat.bgGradient,
                color: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {stat.icon}
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2">
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ 
            p: 3,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Loan Trends
            </Typography>
            <Line 
              data={chartData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }} 
              height={300} 
            />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Paper sx={{ 
            p: 3, 
            height: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Recent Activity
            </Typography>
            <Divider sx={{ my: 2 }} />
            {/* Add recent activity list here */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 