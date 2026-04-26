#!/bin/bash

# WhatsApp Bot - VPS Setup Script
# Usage: chmod +x setup-vps.sh && ./setup-vps.sh

set -e

echo "🤖 WhatsApp Bot - VPS Setup"
echo "=============================="

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 18
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install Git (usually pre-installed)
sudo apt-get install -y git

# Create application directory
APP_DIR="/home/$(whoami)/whatsapp-bot"
echo "📁 Creating app directory: $APP_DIR"
mkdir -p "$APP_DIR"
cd "$APP_DIR"

# Clone repository (update with your repo URL)
echo "📥 Cloning repository..."
git clone https://github.com/YOUR-USERNAME/Charlse-md.git .

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Start bot with PM2
echo "🚀 Starting bot with PM2..."
pm2 start index.js --name "whatsapp-bot"
pm2 startup
pm2 save

# Display QR code instructions
echo ""
echo "=============================="
echo "✅ Setup complete!"
echo "=============================="
echo ""
echo "📱 Next steps:"
echo "1. Run: pm2 logs whatsapp-bot"
echo "2. Scan the QR code with WhatsApp"
echo "3. Bot will be running automatically"
echo ""
echo "Useful commands:"
echo "  pm2 logs whatsapp-bot      # View logs"
echo "  pm2 restart whatsapp-bot   # Restart bot"
echo "  pm2 stop whatsapp-bot      # Stop bot"
echo "  pm2 delete whatsapp-bot    # Remove from PM2"
echo ""
