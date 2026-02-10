/* ============================================
   PERSONAWEB — Authentication Manager
   ============================================ */

const Auth = {
    login(email, password) {
        const creds = StorageManager.getAuth();
        if (email === creds.email && password === creds.password) {
            const session = {
                email,
                loggedInAt: new Date().toISOString(),
                token: this._generateToken()
            };
            StorageManager.setSession(session);
            return { success: true, session };
        }
        return { success: false, message: "Invalid email or password" };
    },

    logout() {
        StorageManager.clearSession();
        window.location.href = 'login.html';
    },

    isAuthenticated() {
        const session = StorageManager.getSession();
        return !!session && !!session.token;
    },

    getSession() {
        return StorageManager.getSession();
    },

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    _generateToken() {
        const arr = new Uint8Array(32);
        crypto.getRandomValues(arr);
        return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
    }
};
