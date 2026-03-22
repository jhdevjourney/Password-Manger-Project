# Password Manager - Desktop Application

A secure, local password manager desktop application built with **Electron**, **HTML/CSS**, and **JavaScript**.

## Features

- **Secure Password Storage** - Passwords encrypted and stored locally on your device
- **Beautiful UI** - Modern, responsive interface with smooth animations
- **No Cloud** - All data stays on YOUR computer—no servers, no internet required
- **Portable** - Download and run immediately, no installation needed
- **Easy to Use** - Simple and intuitive design
- **Open Source** - View the source code on GitHub

## What This App Does

- Add Passwords - Save passwords with service name, username, and notes
- View Passwords - See all your saved passwords in one place (toggle visibility)
- Copy to Clipboard - Quickly copy passwords with one click
- Delete Passwords - Remove passwords you no longer need
- Encrypt Data - Passwords are encrypted before storage for security
- No Internet - Works completely offline

## Quick Start

### Download & Run (No Installation)
1. Download `PasswordManager.zip`
2. Extract it
3. Double-click `RUN_PASSWORD_MANAGER.bat` or `Password Manager.exe`
4. Start saving passwords!

### For Developers

```bash
# Install dependencies
npm install

# Run in development
npm start

# Build executable
npm run build
```

## Project Structure

```
password-manager/
├── main.js          # Electron backend
├── preload.js       # Security layer
├── package.json     # Dependencies
├── src/
│   ├── index.html   # UI
│   ├── styles.css   # Design
│   └── renderer.js  # Password logic & encryption
├── README.md
└── .gitignore
```

## How It Works

1. User adds password - Enters service, username, password
2. Password encrypted - Secured before saving
3. Stored locally - Saved to `AppData\Roaming\password-manager\`
4. User views password - Can toggle visibility or copy to clipboard
5. All offline - No internet or cloud services needed

## Data Storage

- Windows: `C:\Users\YourName\AppData\Roaming\password-manager\passwords.json`
- No data leaves your device - Everything stays local

## Technologies Used

- Electron - Desktop app framework
- JavaScript (ES6+) - Core logic
- HTML5 - User interface
- CSS3 - Styling & animations
- Node.js - Development

## System Requirements

- Windows 10 or later (64-bit)
- ~180 MB free space
- No additional software needed

## Security

- Passwords encrypted before storage
- No cloud or internet required
- No account creation
- No tracking or analytics
- All code open source for verification

---

Built by: JH DevJourney
License: MIT
Status: Production Ready
