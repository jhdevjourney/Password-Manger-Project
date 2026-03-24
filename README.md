# Password Manager Project

## Overview

This project is a basic password manager application developed as a learning exercise. It provides a foundational structure for securely storing and retrieving credentials, and is intended as a starting point for further development and experimentation.

The main goal of this project was to explore concepts such as application structure, data handling, and basic encryption mechanisms using modern development tools.

## Disclaimer

This project is **not intended for production use** and should not be used to store real or sensitive credentials. It has not been audited for security and does not implement industry-standard cryptographic practices.

## Features

* Add and store credentials (e.g., website, username, password)
* Basic encryption and decryption of stored data
* Simple and extendable project structure
* Local data storage

## Technologies Used

* JavaScript
* Node.js
* Electron
* JSON for local data storage

## Project Structure

```
/project-root
  ├── main.js        # Application entry point
  ├── renderer.js    # Frontend logic
  ├── index.html     # User interface
  ├── storage/       # Local data storage
  └── utils/         # Helper functions (e.g., encryption)
```

## How It Works

The application uses a master password to encrypt and decrypt stored credentials. Data is saved locally in an encrypted format and can be accessed through the user interface.

At a high level:

1. The user enters a master password
2. Credentials are encrypted before being stored
3. Stored data is decrypted when accessed

## Limitations

* No secure key derivation (e.g., Argon2, PBKDF2)
* No authentication mechanisms beyond basic password usage
* No protection against brute-force or memory-based attacks
* Encryption implementation is simplified and not production-ready

## Learning Objectives

This project helped to understand:

* The architecture of desktop applications using Electron
* Basic principles of encryption and data protection
* Structuring a small-scale application
* Working with local file storage

## Future Improvements

* Implement secure key derivation (e.g., Argon2 or PBKDF2)
* Use authenticated encryption (e.g., AES-256-GCM)
* Add auto-lock and session management
* Improve error handling and input validation
* Enhance UI/UX
* Introduce secure storage mechanisms

## Getting Started

### Prerequisites

* Node.js installed

### Installation

```
git clone <repository-url>
cd password-manager-project
npm install
```

### Run the Application

```
npm start
```

## Motivation

This project was created to experiment with building a real-world application from scratch and to provide a simple foundation that others can extend without needing to set up the initial structure.

## License

This project is open-source and available under the MIT License.

---

Built by: JHDevJourney
License: MIT
Status: Production Ready
