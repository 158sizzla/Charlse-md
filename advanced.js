// ============================================
// Example: Advanced WhatsApp Bot Features
// ============================================

const { Client, MessageMedia } = require('whatsapp-web.js');

// 1. SEND MESSAGE TO SPECIFIC CONTACT
async function sendMessageToContact(client, phoneNumber, message) {
  const formattedPhone = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@c.us`;
  await client.sendMessage(formattedPhone, message);
}

// 2. SEND IMAGE
async function sendImage(client, phoneNumber, imagePath, caption = '') {
  const media = MessageMedia.fromFilePath(imagePath);
  const formattedPhone = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@c.us`;
  await client.sendMessage(formattedPhone, media, { caption });
}

// 3. BROADCAST MESSAGE
async function broadcastMessage(client, phoneNumbers, message) {
  for (const phone of phoneNumbers) {
    await sendMessageToContact(client, phone, message);
  }
}

// 4. GET CONTACT INFO
async function getContactInfo(client, phoneNumber) {
  const formattedPhone = phoneNumber.includes('@') ? phoneNumber : `${phoneNumber}@c.us`;
  const contact = await client.getContactById(formattedPhone);
  return contact;
}

// 5. AUTO-REPLY WITH TYPING INDICATOR
async function autoReplyWithTyping(message, replyText, typingTime = 2000) {
  await message.getChat().then(chat => chat.sendStateTyping());
  typename setTimeout(async () => {
    await message.reply(replyText);
  }, typingTime);
}

// 6. HANDLE GROUP MESSAGES
async function handleGroupMessage(client, message) {
  if (message.isGroup) {
    const chatId = message.from;
    const contact = await client.getContactById(chatId);
    console.log(`Group message from: ${contact.name}`);
    
    // Respond to all group messages
    if (message.body.includes('hello')) {
      await message.reply('Hello from the bot! 👋');
    }
  }
}

// 7. CREATE MESSAGE HANDLERS
const messageHandlers = {
  'hello': (message) => message.reply('Hello! 👋'),
  'time': (message) => message.reply(`Current time: ${new Date().toLocaleTimeString()}`),
  'help': (message) => message.reply('Available commands: hello, time, help'),
};

async function processCommand(message) {
  const command = message.body.toLowerCase().trim();
  
  if (messageHandlers[command]) {
    await messageHandlers[command](message);
  }
}

module.exports = {
  sendMessageToContact,
  sendImage,
  broadcastMessage,
  getContactInfo,
  autoReplyWithTyping,
  handleGroupMessage,
  processCommand,
  messageHandlers
};
