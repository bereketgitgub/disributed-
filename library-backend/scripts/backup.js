import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const BACKUP_RETENTION_DAYS = 7;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

// Create backup filename with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.sql`);

// MySQL backup command
const command = `mysqldump -h ${process.env.DB_HOST} -u ${process.env.DB_USER} \
  ${process.env.DB_PASSWORD ? `-p${process.env.DB_PASSWORD}` : ''} \
  ${process.env.DB_NAME} > ${backupFile}`;

// Execute backup
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Backup failed: ${error}`);
    return;
  }
  console.log(`Backup created: ${backupFile}`);

  // Clean up old backups
  fs.readdir(BACKUP_DIR, (err, files) => {
    if (err) {
      console.error(`Failed to read backup directory: ${err}`);
      return;
    }

    const now = new Date();
    files.forEach(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      const daysOld = (now - stats.mtime) / (1000 * 60 * 60 * 24);

      if (daysOld > BACKUP_RETENTION_DAYS) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old backup: ${file}`);
      }
    });
  });
}); 