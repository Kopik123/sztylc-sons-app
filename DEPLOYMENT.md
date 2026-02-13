# Deployment Guide - Sztylc & Sons

## Production Deployment Checklist

### Pre-deployment

- [ ] Review and update all environment variables
- [ ] Set strong `NEXTAUTH_SECRET` (minimum 32 characters)
- [ ] Configure production PostgreSQL database
- [ ] Review security settings
- [ ] Test all features in staging environment
- [ ] Run database migrations
- [ ] Seed production database with initial admin user

### Environment Variables

Create a `.env.production` file with the following:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# PostgreSQL (for Docker Compose)
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_strong_password
POSTGRES_DB=sztylc_production

# NextAuth.js - MUST CHANGE IN PRODUCTION
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=generate-a-random-secret-minimum-32-characters

# Application
NODE_ENV=production

# Payroll Configuration
FULL_DAY_HOURS=8
FULL_DAY_RATE=120
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

1. **Prepare the server:**
```bash
# Install Docker and Docker Compose
sudo apt update
sudo apt install docker.io docker-compose -y
```

2. **Clone repository:**
```bash
git clone <your-repo-url>
cd sztylc-sons-app
```

3. **Setup environment:**
```bash
cp .env.example .env.production
# Edit .env.production with production values
nano .env.production
```

4. **Build and start:**
```bash
docker-compose up -d --build
```

5. **Run migrations:**
```bash
docker-compose exec app npm run db:migrate
```

6. **Create initial admin user:**
```bash
docker-compose exec app npm run db:seed
```

7. **Check logs:**
```bash
docker-compose logs -f app
```

### Option 2: Platform as a Service (Vercel/Railway/Render)

#### Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Setup PostgreSQL:**
- Use Vercel Postgres, Supabase, or other managed PostgreSQL
- Add `DATABASE_URL` to Vercel environment variables

4. **Environment Variables:**
```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

#### Railway

1. **Create new project on Railway**

2. **Add PostgreSQL database:**
- Click "New" → "Database" → "PostgreSQL"
- Copy the connection string

3. **Deploy from GitHub:**
- Connect your repository
- Railway will auto-detect Next.js

4. **Set environment variables:**
- Add all variables from `.env.example`
- Use the PostgreSQL connection string from Railway

### Option 3: VPS (Ubuntu Server)

1. **Install dependencies:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib nodejs npm nginx certbot python3-certbot-nginx -y
```

2. **Setup PostgreSQL:**
```bash
sudo -u postgres psql
CREATE DATABASE sztylc_production;
CREATE USER sztylc WITH ENCRYPTED PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE sztylc_production TO sztylc;
\q
```

3. **Clone and setup application:**
```bash
git clone <your-repo-url>
cd sztylc-sons-app
npm install
cp .env.example .env
# Edit .env with production values
nano .env
```

4. **Build application:**
```bash
npm run build
```

5. **Setup PM2 for process management:**
```bash
sudo npm install -g pm2
pm2 start npm --name "sztylc-app" -- start
pm2 save
pm2 startup
```

6. **Configure Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Setup SSL with Let's Encrypt:**
```bash
sudo certbot --nginx -d your-domain.com
```

## Post-deployment

### 1. Database Backup

Setup automated backups:

```bash
# PostgreSQL backup script
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U sztylc sztylc_production > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -type f -mtime +7 -delete  # Keep 7 days
```

Add to crontab:
```bash
0 2 * * * /path/to/backup-script.sh
```

### 2. Monitoring

Install monitoring tools:

```bash
# Application monitoring
pm2 install pm2-logrotate

# Server monitoring
sudo apt install netdata -y
```

### 3. Security Hardening

```bash
# Firewall setup
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Fail2ban for SSH protection
sudo apt install fail2ban -y
```

### 4. Health Checks

Create a health check endpoint in your application:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'healthy', timestamp: new Date() })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: 'Database connection failed' },
      { status: 503 }
    )
  }
}
```

### 5. Application Updates

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Run migrations
npm run db:migrate

# Rebuild
npm run build

# Restart application
pm2 restart sztylc-app

# For Docker
docker-compose pull
docker-compose up -d --build
```

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U sztylc -h localhost -d sztylc_production

# View logs
docker-compose logs postgres
```

### Application Errors

```bash
# Check application logs
pm2 logs sztylc-app

# For Docker
docker-compose logs app

# Check Next.js build
npm run build
```

### Performance Issues

```bash
# Monitor resource usage
htop

# Check database performance
docker-compose exec postgres psql -U sztylc -d sztylc_production -c "SELECT * FROM pg_stat_activity;"
```

## Security Best Practices

1. **Regular Updates:**
   - Keep Node.js and dependencies updated
   - Apply security patches promptly

2. **Access Control:**
   - Use strong passwords
   - Enable 2FA for admin accounts
   - Limit database access to application only

3. **SSL/TLS:**
   - Always use HTTPS in production
   - Renew SSL certificates before expiry

4. **Logging:**
   - Enable application logging
   - Monitor for suspicious activity
   - Rotate logs regularly

5. **Backups:**
   - Daily automated database backups
   - Test restore procedures
   - Store backups in different location

## Support

For deployment issues or questions, contact the development team.
