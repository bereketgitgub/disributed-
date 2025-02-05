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
import { LibraryBooks } from '@mui/icons-material';

const LibrarianDashboard = () => {
  const menuItem = {
    title: 'Book Management',
    description: 'Manage library books, track loans, and handle returns',
    icon: <LibraryBooks sx={{ fontSize: 40 }} />,
    path: '/librarian/books',
    color: '#1976d2'
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Librarian Dashboard
        </Typography>
      </Box>

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
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
                  color: menuItem.color
                }}
              >
                {menuItem.icon}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {menuItem.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {menuItem.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                component={Link} 
                to={menuItem.path}
                variant="contained"
                fullWidth
                sx={{ 
                  bgcolor: menuItem.color,
                  '&:hover': {
                    bgcolor: menuItem.color,
                    filter: 'brightness(0.9)'
                  }
                }}
              >
                Manage Books
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LibrarianDashboard;