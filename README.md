# WhatsApp Bot

A simple WhatsApp bot built with Node.js using `whatsapp-web.js`.

## Features

- ✅ Automated WhatsApp messaging
- ✅ Command handling
- ✅ Session persistence
- ✅ QR code authentication
- ✅ Error handling

## Prerequisites

- Node.js 14+
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo>
cd Charlse-md
```

2. Install dependencies:
```bash
npm install
```

3. Start the bot:
```bash
npm start
```

4. Scan the QR code with your WhatsApp phone:
   - Open WhatsApp on your phone
   - Go to Settings → Linked Devices → Link a Device
   - Scan the QR code shown in the terminal

5. Copy `.env.example` to `.env` for local configuration:
```bash
cp .env.example .env
```

## Usage

### Available Commands

- **ping** - Bot replies with "pong 🏓"
- **!help** - Shows available commands

### Customization

Edit `index.js` to add your own commands and logic:

```javascript
if (message.body === 'your-command') {
  await message.reply('Your response');
}
```

## Deploying on Heroku

This bot can run as a Heroku web dyno using the Node.js buildpack and a Chrome buildpack.

A GitHub Actions workflow is included at `.github/workflows/deploy-heroku.yml`. It can deploy to Heroku automatically when you push to `main`.

### Required GitHub secrets

- `HEROKU_API_KEY`
- `HEROKU_EMAIL`
- `HEROKU_APP_NAME`

If you configure these secrets, the workflow will deploy the repository to the named Heroku app.

An `app.json` manifest is included for Heroku apps and Review Apps.

1. Install the Heroku CLI and log in:
   ```bash
   heroku login
   ```
2. Create a new Heroku app:
   ```bash
   heroku create
   ```
3. Add the Chrome buildpack:
   ```bash
   heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-google-chrome
   ```
4. Deploy your code:
   ```bash
   git push heroku main
   ```
5. Scale the web dyno:
   ```bash
   heroku ps:scale web=1
   ```
6. View logs while the bot starts:
   ```bash
   heroku logs --tail
   ```

### Retrieve the current session file

If your app is running and has already authenticated, you can retrieve the saved session via a secure endpoint:

```bash
curl "https://<your-heroku-app>.herokuapp.com/session?token=<SESSION_ACCESS_TOKEN>"
```

### Heroku app URL

Once your app name is set to `HEROKU_APP_NAME`, your bot URL will be:

```text
https://<HEROKU_APP_NAME>.herokuapp.com
```

For example, if you create the app name `charlse-md-bot`, the bot link becomes:

```text
https://charlse-md-bot.herokuapp.com
```

> Security note: keep `SESSION_ACCESS_TOKEN` secret and do not share it publicly.
>
> Note: Heroku dyno storage is ephemeral. If the dyno restarts, `session.json` will be lost and you may need to re-authenticate by scanning the QR code again.

## Project Structure

```
├── app.json          # Heroku app manifest
├── index.js          # Main bot file
├── package.json      # Dependencies
├── .env.example      # Example environment configuration
├── .env              # Environment variables
├── .gitignore        # Git ignore rules
└── session.json      # Auto-generated session (not tracked)
```

## How It Works

1. **QR Authentication**: When you first run the bot, it generates a QR code
2. **Session Saving**: Once authenticated, the session is saved to `session.json`
3. **Message Listening**: The bot listens for incoming messages and processes them
4. **Command Handling**: Responds to specific commands

## License

MIT