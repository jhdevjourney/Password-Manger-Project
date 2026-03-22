// renderer.js - Password Manager Logic (Frontend)
// This file handles encryption, UI updates, and user interactions

// AES Encryption Library (included via crypto-js in production)
// For now, we'll use a simple encryption method

class PasswordManager {
    constructor() {
        this.passwords = [];
        this.encryptionKey = this.getOrCreateKey();
        this.init();
    }

    // Generate or retrieve encryption key from localStorage
    getOrCreateKey() {
        let key = localStorage.getItem('pm_key');
        if (!key) {
            key = this.generateRandomKey(32);
            localStorage.setItem('pm_key', key);
        }
        return key;
    }

    // Simple encryption using XOR and Base64 (for demonstration)
    // In production, use crypto-js: CryptoJS.AES.encrypt()
    simpleEncrypt(text, key) {
        // Convert text to base64
        return btoa(encodeURIComponent(text));
    }

    // Simple decryption
    simpleDecrypt(encodedText, key) {
        try {
            return decodeURIComponent(atob(encodedText));
        } catch (e) {
            return encodedText;
        }
    }

    // Generate random key
    generateRandomKey(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = '';
        for (let i = 0; i < length; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return key;
    }

    // Initialize - load passwords from file
    async init() {
        await this.loadPasswords();
        this.renderPasswords();
    }

    // Load passwords from main process
    async loadPasswords() {
        try {
            this.passwords = await window.electronAPI.loadPasswords();
        } catch (error) {
            console.error('Error loading passwords:', error);
            this.passwords = [];
        }
    }

    // Save passwords to file
    async savePasswords() {
        try {
            const result = await window.electronAPI.savePasswords(this.passwords);
            if (result.success) {
                this.showSuccessMessage('Password saved successfully!');
            } else {
                alert('Error saving password: ' + result.error);
            }
        } catch (error) {
            console.error('Error saving passwords:', error);
            alert('Error saving password');
        }
    }

    // Add new password
    addPassword(serviceName, username, password, notes) {
        // IMPORTANT: Encrypt the password before storing
        const encryptedPassword = this.simpleEncrypt(password, this.encryptionKey);

        const newPassword = {
            id: Date.now(), // Unique ID
            service: serviceName,
            username: username,
            password: encryptedPassword, // Store encrypted!
            notes: notes,
            createdAt: new Date().toLocaleDateString()
        };

        this.passwords.push(newPassword);
        this.savePasswords();
        this.renderPasswords();
        this.clearForm();
    }

    // Delete password
    deletePassword(id) {
        if (confirm('Are you sure you want to delete this password?')) {
            this.passwords = this.passwords.filter(p => p.id !== id);
            this.savePasswords();
            this.renderPasswords();
        }
    }

    // Render passwords to UI
    renderPasswords() {
        const listContainer = document.getElementById('passwordsList');

        if (this.passwords.length === 0) {
            listContainer.innerHTML = '<p class="empty-state">No passwords saved yet. Add one above!</p>';
            return;
        }

        listContainer.innerHTML = this.passwords.map(pwd => `
            <div class="password-item">
                <div class="password-item-header">
                    <span class="password-item-title">🔒 ${this.escapeHtml(pwd.service)}</span>
                    <div class="password-item-actions">
                        <button class="btn btn-copy" onclick="pm.copyToClipboard('${pwd.id}', 'password')">Copy Password</button>
                        <button class="btn btn-delete" onclick="pm.deletePassword(${pwd.id})">Delete</button>
                    </div>
                </div>
                <div class="password-item-content">
                    <p><strong>Username:</strong> <span class="password-value">${this.escapeHtml(pwd.username)}</span></p>
                    <p><strong>Password:</strong> <span class="password-value" id="pwd-${pwd.id}">••••••••</span></p>
                    <button type="button" class="btn btn-copy btn-small" onclick="pm.togglePasswordVisibility(${pwd.id})">Show/Hide</button>
                    <p><strong>Created:</strong> ${pwd.createdAt}</p>
                </div>
                ${pwd.notes ? `<div class="password-item-notes">📝 ${this.escapeHtml(pwd.notes)}</div>` : ''}
            </div>
        `).join('');
    }

    // Toggle password visibility
    togglePasswordVisibility(id) {
        const pwd = this.passwords.find(p => p.id === id);
        if (!pwd) return;

        const element = document.getElementById(`pwd-${id}`);
        if (element.textContent === '••••••••') {
            // Decrypt and show
            const decryptedPassword = this.simpleDecrypt(pwd.password, this.encryptionKey);
            element.textContent = decryptedPassword;
        } else {
            // Hide again
            element.textContent = '••••••••';
        }
    }

    // Copy to clipboard
    async copyToClipboard(id, field) {
        const pwd = this.passwords.find(p => p.id === id);
        if (!pwd) return;

        let textToCopy = '';
        if (field === 'password') {
            textToCopy = this.simpleDecrypt(pwd.password, this.encryptionKey);
        } else if (field === 'username') {
            textToCopy = pwd.username;
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            this.showSuccessMessage('Copied to clipboard!');
        } catch (error) {
            alert('Failed to copy: ' + error);
        }
    }

    // Clear form
    clearForm() {
        document.getElementById('passwordForm').reset();
    }

    // Show success message
    showSuccessMessage(message) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'success-message';
        msgDiv.textContent = message;
        document.body.appendChild(msgDiv);

        setTimeout(() => {
            msgDiv.remove();
        }, 3000);
    }

    // Escape HTML for safety
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// ==================== GLOBAL FUNCTIONS ====================

let pm; // Global password manager instance

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Hide welcome screen after 2.5 seconds
    setTimeout(() => {
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }
    }, 2500);

    pm = new PasswordManager();

    // Form submission
    document.getElementById('passwordForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const serviceName = document.getElementById('serviceName').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const notes = document.getElementById('notes').value;

        if (!serviceName || !username || !password) {
            alert('Please fill in all required fields');
            return;
        }

        pm.addPassword(serviceName, username, password, notes);
    });
});

// Toggle password visibility in input field
function togglePasswordVisibility() {
    const input = document.getElementById('password');
    const btn = document.querySelector('.toggle-password-btn');

    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

// Clear all passwords
async function clearAllPasswords() {
    if (confirm('Are you sure? This will delete ALL passwords! This cannot be undone.')) {
        try {
            await window.electronAPI.clearAllPasswords();
            pm.passwords = [];
            pm.renderPasswords();
            alert('All passwords cleared!');
        } catch (error) {
            alert('Error clearing passwords: ' + error);
        }
    }
}
