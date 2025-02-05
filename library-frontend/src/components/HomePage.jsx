import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  Paper,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  LocalLibrary,
  MenuBook,
  Search,
  TrendingUp,
  Bookmark,
  StarBorder,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { heroImage } from '../assets/index.js';
import api from '../services/api';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats/overview');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Search sx={{ fontSize: 40 }} />,
      title: 'Browse Collection',
      description: 'Explore our vast collection of books across various genres',
      path: '/books',
      color: theme.palette.primary.main,
    },
    {
      icon: <MenuBook sx={{ fontSize: 40 }} />,
      title: 'My Loans',
      description: 'View and manage your borrowed books',
      path: '/my-loans',
      color: theme.palette.secondary.main,
      requiresAuth: true,
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Popular Now',
      description: 'Discover trending and popular books',
      path: '/trending',
      color: '#2C7A7B',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h1" sx={{ mb: 2, fontWeight: 700 }}>
            Welcome to Your Library
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, maxWidth: '600px' }}>
            Discover millions of books, manage your loans, and explore our digital collection.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/books')}
              sx={{ 
                bgcolor: theme.palette.secondary.main,
                '&:hover': { bgcolor: theme.palette.secondary.dark }
              }}
            >
              Browse Books
            </Button>
            {!user && (
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ color: 'white', borderColor: 'white' }}
              >
                Sign In
              </Button>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ color: feature.color, mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ bgcolor: 'background.default', py: 6 }}>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" gutterBottom>
                    {stats?.totalBooks || 0}
                  </Typography>
                  <Typography variant="h6">Books Available</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" gutterBottom>
                    {stats?.activeLoans || 0}
                  </Typography>
                  <Typography variant="h6">Active Loans</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h3" color="primary" gutterBottom>
                    {stats?.totalMembers || 0}
                  </Typography>
                  <Typography variant="h6">Members</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default HomePage; 