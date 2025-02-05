# Deployment Checklist

## Database
- [ ] XAMPP MySQL service is running
- [ ] Database 'library_management' exists
- [ ] All required tables are created
- [ ] Sample data is loaded (if needed)
- [ ] Database user has correct permissions

## Backend
- [ ] All environment variables are set
- [ ] Database connection is successful
- [ ] SMTP service is configured
- [ ] All routes are responding
- [ ] Cron jobs are scheduled
- [ ] Logs are being generated

## Frontend
- [ ] API base URL is correctly configured
- [ ] Environment variables are set
- [ ] Build completes successfully
- [ ] Assets are loading
- [ ] Routes are working

## Testing Steps
1. Run backend pre-deployment check:
   ```bash
   npm run precheck
   ```

2. Test frontend build:
   ```bash
   cd library-frontend
   npm run build
   ```

3. Test full system:
   - Start XAMPP (MySQL)
   - Start backend: `npm run dev`
   - Start frontend: `npm run dev`
   - Navigate to http://localhost:3000
   - Test login functionality
   - Test book management
   - Test loan operations
   - Check reports generation 