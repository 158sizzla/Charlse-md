FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (if needed for webhooks)
EXPOSE 3000

# Start the bot
CMD ["npm", "start"]
