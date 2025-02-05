import { useState } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  Box 
} from '@mui/material';
import CirculationReport from './CirculationReport';
import MemberReport from './MemberReport';
import FinancialReport from './FinancialReport';
import InventoryReport from './InventoryReport';

const ReportsDashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Library Reports
      </Typography>
      
      <Paper sx={{ mb: 2 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab label="Circulation" />
          <Tab label="Members" />
          <Tab label="Financial" />
          <Tab label="Inventory" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {currentTab === 0 && <CirculationReport />}
        {currentTab === 1 && <MemberReport />}
        {currentTab === 2 && <FinancialReport />}
        {currentTab === 3 && <InventoryReport />}
      </Box>
    </Container>
  );
};

export default ReportsDashboard; 