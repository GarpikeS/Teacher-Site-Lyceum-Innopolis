#!/bin/bash
cd /root/Teacher-Site-Lyceum-Innopolis

# Check for new commits
git fetch origin master 2>/dev/null
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/master)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "$(date): New commits found, deploying..."
    git pull origin master
    npm install --legacy-peer-deps 2>/dev/null

    if npm run build 2>&1 | tee /tmp/teacher-build.log | tail -10; then
        echo "$(date): Build successful, restarting services..."
        pm2 restart teacher-web teacher-api teacher-executor
        echo "$(date): Deploy complete"
    else
        echo "$(date): BUILD FAILED — services NOT restarted"
        tail -20 /tmp/teacher-build.log
    fi
fi
