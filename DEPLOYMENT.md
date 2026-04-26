# WhatsApp Bot Deployment Guide

## 🚀 Deployment Options

### Option 1: Heroku (Free Tier Discontinued - Use Alternatives)

### Option 2: **Railway.app** (Recommended - Free Trial)

1. **Sign up at [railway.app](https://railway.app)**

2. **Connect your GitHub repository:**
   - Create a GitHub repository and push your code
   - Login to Railway with GitHub
   - Create a new project → Deploy from GitHub repo

3. **Add Procfile** (required for Railway):
```
worker: npm start
```

4. **Environment Variables:**
   - Go to Railway Project → Variables
   - Add any `.env` variables you need

5. **Deploy:**
   - Railway auto-deploys on GitHub push
   - Check logs in Railway dashboard

---

### Option 3: **Render.com** (Free Tier + Paid Plans)

1. **Sign up at [render.com](https://render.com)**

2. **Create New Background Worker:**
   - Select "Build and deploy from GitHub"
   - Choose your repository
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

3. **Set Environment Variables:**
   - Add variables in Render dashboard

4. **Deploy** → Automatic deployment on push

---

### Option 4: **Docker + Cloud Run / VPS**

#### Create Dockerfile:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD ["npm", "start"]
```

#### Deploy to Google Cloud Run:
```bash
# Build image
docker build -t whatsapp-bot .

# Push to Google Container Registry
docker tag whatsapp-bot gcr.io/YOUR-PROJECT-ID/whatsapp-bot
docker push gcr.io/YOUR-PROJECT-ID/whatsapp-bot

# Deploy
gcloud run deploy whatsapp-bot --image gcr.io/YOUR-PROJECT-ID/whatsapp-bot
```

---

### Option 5: **VPS (AWS EC2, DigitalOcean, Linode)**

1. **SSH into your server:**
```bash
ssh root@your-server-ip
```

2. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Clone and setup:**
```bash
git clone https://github.com/YOUR-USERNAME/Charlse-md.git
cd Charlse-md
npm install
```

4. **Run with PM2 (process manager):**
```bash
npm install -g pm2
pm2 start index.js --name "whatsapp-bot"
pm2 startup
pm2 save
```

5. **Check status:**
```bash
pm2 logs whatsapp-bot
```

---

### Option 6: **GitHub Action + VPS** (Automation)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd Charlse-md
            git pull
            npm install
            pm2 restart whatsapp-bot
```

---

## ⚙️ Important Considerations

### Session Management
Your `session.json` will be generated after first QR scan. For cloud deployment:

1. **Save session to GitHub** (⚠️ Be careful with sensitive data):
   - Commit `session.json` after first scan
   - Or use database storage

2. **Use Environment Variables:**
   - Store session data in a database (MongoDB, etc.)
   - Load on startup

3. **Alternative: Use headless browser persistence:**
   - Keep session files persistent in your server

### Memory & CPU
- **WhatsApp bot needs:** 256MB+ RAM
- **Puppeteer (included):** Uses ~150MB
- **Keep-alive:** Add periodic health checks

### Webhook Alternative (No Persistent Connection)
Use Twilio or WhatsApp Business API for webhook-based approach (more scalable):
```bash
npm install twilio
```

---

## 📋 Pre-Deployment Checklist

- [ ] Authenticate bot locally first (get `session.json`)
- [ ] Test all commands work
- [ ] Add error logging/monitoring
- [ ] Set up `.gitignore` properly
- [ ] Configure environment variables
- [ ] Test on target platform
- [ ] Monitor logs after deployment

---

## 🔍 Monitoring & Logs

**Railway:**
```
Dashboard → Project → Deployments → Logs
```

**Render:**
```
Services → Your App → Logs
```

**VPS (PM2):**
```bash
pm2 logs whatsapp-bot
pm2 monit
```

---

## ⚠️ Known Issues & Solutions

**Issue:** Bot disconnects after 30 minutes
- **Solution:** Add keep-alive mechanism or use reverse tunnel

**Issue:** Session expires
- **Solution:** Re-authenticate periodically or store in database

**Issue:** High memory usage
- **Solution:** Restart bot daily with cron job or use lightweight alternative

---

## 🎯 Recommended Setup (Budget-Friendly)

1. **Railway.app** - $5-7/month (easiest)
2. **DigitalOcean Droplet** - $4-6/month (more control)
3. **Google Cloud Run** - Pay-per-use (best for low traffic)

Choose based on your needs! 🚀
