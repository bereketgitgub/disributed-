import { WebSocketServer } from 'ws';
import { verifyToken } from '../middleware/auth.js';

export const initializeWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (ws, req) => {
    try {
      // Extract token from URL or headers
      const token = req.url.split('token=')[1];
      const user = await verifyToken(token);
      ws.userId = user.userId;
      ws.userRole = user.role;

      // Send initial data
      if (ws.userRole === 'admin') {
        sendAdminUpdates(ws);
      }
      sendUserUpdates(ws);

    } catch (error) {
      ws.close();
    }
  });

  return wss;
};

export const broadcastToAdmins = (wss, type, data) => {
  wss.clients.forEach(client => {
    if (client.userRole === 'admin') {
      client.send(JSON.stringify({ type, data }));
    }
  });
};

export const sendToUser = (wss, userId, type, data) => {
  wss.clients.forEach(client => {
    if (client.userId === userId) {
      client.send(JSON.stringify({ type, data }));
    }
  });
}; 