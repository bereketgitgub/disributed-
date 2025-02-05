#!/bin/bash

# Add daily backup at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/bin/node /path/to/library-backend/scripts/backup.js") | crontab - 