import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Divider
} from '@mui/material';
import {
  NotificationsOutlined,
  ErrorOutline,
  InfoOutlined,
  WarningOutlined,
  CheckCircleOutline,
  Delete as DeleteIcon,
  MarkEmailRead as MarkReadIcon
} from '@mui/icons-material';
import api from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationSystem = () => {
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ERROR':
        return <ErrorOutline color="error" />;
      case 'WARNING':
        return <WarningOutlined color="warning" />;
      case 'SUCCESS':
        return <CheckCircleOutline color="success" />;
      default:
        return <InfoOutlined color="info" />;
    }
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsOutlined />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: 360,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem>
            <ListItemText primary="No notifications" />
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem key={notification.notification_id}>
              <ListItemIcon>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={notification.message}
                sx={{ opacity: notification.is_read ? 0.6 : 1 }}
              />
              <IconButton
                size="small"
                onClick={() => markAsRead(notification.notification_id)}
              >
                <MarkReadIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => deleteNotification(notification.notification_id)}
              >
                <DeleteIcon />
              </IconButton>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationSystem; 