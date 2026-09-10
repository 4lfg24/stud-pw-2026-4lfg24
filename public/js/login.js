/**
 * js/login.js
 * Gestisce la logica di login dell'utente.
 */

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorDiv = document.getElementById('login-error');
    const successDiv = document.getElementById('login-success');
    const regErrorDiv = document.getElementById('register-error');
    const regSuccessDiv = document.getElementById('register-success');

    // Elementi per il toggle
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    if (showRegisterLink && showLoginLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        });

        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Nascondi i messaggi precedenti
            errorDiv.classList.add('hidden');
            successDiv.classList.add('hidden');
            
            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;
            
            try {
                // Chiamata all'API di login
                const response = await API.login({ username: usernameInput, password: passwordInput });
                
                // Se la chiamata ha successo, salva il token e l'username
                if (response.token) {
                    localStorage.setItem('auth_token', response.token);
                    localStorage.setItem('username', response.username);
                    
                    // Mostra successo
                    successDiv.classList.remove('hidden');
                    
                    // Reindirizza alla home dopo 1 secondo
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }
            } catch (error) {
                // Mostra errore
                errorDiv.textContent = error.message || "Credenziali non valide o errore di connessione.";
                errorDiv.classList.remove('hidden');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Nascondi i messaggi precedenti
            regErrorDiv.classList.add('hidden');
            regSuccessDiv.classList.add('hidden');
            
            const usernameInput = document.getElementById('reg-username').value;
            const passwordInput = document.getElementById('reg-password').value;
            
            try {
                // Chiamata all'API di registrazione
                await API.register({ username: usernameInput, password: passwordInput });
                
                // Mostra successo
                regSuccessDiv.classList.remove('hidden');
                
                // Effettua subito il login automatico
                const response = await API.login({ username: usernameInput, password: passwordInput });
                
                if (response.token) {
                    localStorage.setItem('auth_token', response.token);
                    localStorage.setItem('username', response.username);
                    
                    // Reindirizza alla home dopo 1 secondo
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }
            } catch (error) {
                // Mostra errore
                regErrorDiv.textContent = error.message || "Errore durante la registrazione.";
                regErrorDiv.classList.remove('hidden');
            }
        });
    }
});
