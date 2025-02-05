import { Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  LibraryBooks,
  People,
} from '@mui/icons-material';

const AdminDashboard = () => {
  const menuItems = [
    {
      title: 'Book Management',
      description: 'Add, edit, and manage library books',
      icon: <LibraryBooks sx={{ fontSize: 40 }} />,
      path: '/admin/books',
      color: '#1976d2'
    },
    {
      title: 'User Management',
      description: 'Manage users and their permissions',
      icon: <People sx={{ fontSize: 40 }} />,
      path: '/admin/users',
      color: '#2e7d32'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} key={item.title}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    mb: 2,
                    color: item.color
                  }}
                >
                  {item.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {item.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  component={Link} 
                  to={item.path}
                  variant="contained"
                  fullWidth
                  sx={{ 
                    bgcolor: item.color,
                    '&:hover': {
                      bgcolor: item.color,
                      filter: 'brightness(0.9)'
                    }
                  }}
                >
                  Access
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 