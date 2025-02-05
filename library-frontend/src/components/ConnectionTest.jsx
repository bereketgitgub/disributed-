import { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import api from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setLoading(true);
      const response = await api.get('/health/check');
      setStatus(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box m={4}>
      <Typography variant="h6" gutterBottom>
        Connection Status
      </Typography>
      
      {error ? (
        <Alert severity="error">
          Connection Error: {error}
        </Alert>
      ) : (
        <Alert severity="success">
          Backend Connected Successfully
          <pre>{JSON.stringify(status, null, 2)}</pre>
        </Alert>
      )}
    </Box>
  );
};

export default ConnectionTest; 