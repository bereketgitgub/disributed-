# Library Management System Deployment Guide

## Prerequisites
- Node.js 16+
- MySQL 8+
- PM2 (for production)
- Git

## Deployment Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd library-management
```

2. Run pre-deployment checks:
```bash
npm run precheck
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run deployment script:
```bash
npm run deploy
```

5. Verify deployment:
- Backend: http://localhost:8080/health
- Frontend: http://localhost:3000
- Admin login: 
  - Username: admin
  - Password: admin123

## Post-deployment Tasks
1. Change admin password
2. Configure backup schedule
3. Set up SSL certificates
4. Configure email notifications

## Troubleshooting
- Check logs: `pm2 logs`
- Database issues: Check MySQL connection
- Frontend issues: Check browser console
- Backend issues: Check server logs 