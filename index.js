require('dotenv').config();
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const http = require('http');

const SESSION_FILE_PATH = './session.json';
const SESSION_ACCESS_TOKEN = process.env.SESSION_ACCESS_TOKEN || 'change-me';
const PORT = process.env.PORT || 3000;

// Load session if it exists
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
  session: sessionData,
  puppeteer: {
    headless: true,
    executablePath: process.env.GOOGLE_CHROME_BIN || undefined,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
      '--no-zygote'
    ]
  }
});

// QR Code for initial login
client.on('qr', (qr) => {
  console.log('QR Code received. Scan it with WhatsApp:');
  qrcode.generate(qr, { small: true });
});

// Client is ready
client.on('ready', () => {
  console.log('✅ Client is ready!');
});

// Listen to messages
client.on('message', async (message) => {
  console.log(`📨 Message from ${message.from}: ${message.body}`);

  // Echo bot example - responds to all messages
  if (message.body === 'ping') {
    await message.reply('pong 🏓');
  }

  // Help command
  if (message.body === '!help') {
    await message.reply(
      'Available commands:\n' +
      '• ping - Reply with pong\n' +
      '• !help - Show this message'
    );
  }
});

// Authentication Success - Save session
client.on('authenticated', (session) => {
  sessionData = session;
  fs.writeFileSync(SESSION_FILE_PATH, JSON.stringify(session));
  console.log('✅ Authentication successful!');
});

// Client disconnected
client.on('disconnected', (reason) => {
  console.log('⚠️ Client disconnected:', reason);
});

// Handle errors
client.on('error', (error) => {
  console.error('❌ Error:', error);
});

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname !== '/session') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not found');
  }

  const authHeader = req.headers.authorization || '';
  const token = url.searchParams.get('token') || authHeader.replace(/^(Bearer|Token)\s+/i, '');

  if (!token || token !== SESSION_ACCESS_TOKEN) {
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    return res.end('Unauthorized');
  }

  if (!fs.existsSync(SESSION_FILE_PATH)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Session not found');
  }

  const sessionJson = fs.readFileSync(SESSION_FILE_PATH, 'utf8');
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(sessionJson);
});

server.listen(PORT, () => {
  console.log(`🔗 Session endpoint listening on port ${PORT}`);
  console.log('    GET /session?token=<SESSION_ACCESS_TOKEN>');
});

client.initialize();
