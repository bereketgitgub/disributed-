import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import api from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test API connection
        const response = await api.get('/health');
        setStatus(response.data);
      } catch (err) {
        setError('Failed to connect to the server');
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        System Connection Status
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            {status?.database ? 
              <CheckCircleIcon color="success" /> : 
              <ErrorIcon color="error" />
            }
          </ListItemIcon>
          <ListItemText 
            primary="Database Connection" 
            secondary={status?.database ? 'Connected' : 'Failed'}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {status?.smtp ? 
              <CheckCircleIcon color="success" /> : 
              <ErrorIcon color="error" />
            }
          </ListItemIcon>
          <ListItemText 
            primary="Email Service" 
            secondary={status?.smtp ? 'Connected' : 'Failed'}
          />
        </ListItem>
      </List>
      {status?.errors.length > 0 && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Errors:</Typography>
          {status.errors.map((err, index) => (
            <Typography key={index} variant="body2">
              {err.component}: {err.error}
            </Typography>
          ))}
        </Alert>
      )}
    </Paper>
  );
};

export default ConnectionTest; 