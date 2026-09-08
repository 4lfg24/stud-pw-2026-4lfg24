/**
 * Questo file gestisce le operazioni di registrazione (signup) e accesso (login) degli utenti,
 * compresa la generazione dei token JWT per le sessioni autenticate.
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken'); // Libreria per creare (sign) e validare i token JWT

const { SECRET_KEY } = require('../middlewares/authMiddleware');

const usersFilePath = path.join(__dirname, '../data/users.json');

const getUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
};

/**
 * Endpoint: POST /api/auth/register
 * Scopo: Registrare un nuovo account utente.
 */
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // VALIDAZIONE LATO SERVER
    if (!username || !password) {
        return res.status(400).json({ error: "Username e password sono richiesti" });
    }

    const users = getUsers();

    // Controlla se esiste già un utente con quello stesso username (evitare duplicati)
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: "Username già in uso. Scegline un altro." });
    }

    const newUser = {
        id: Date.now().toString(),
        username: username,
        password: password //NOTA: più tardi la crittograferemo
    };

    users.push(newUser);
    saveUsers(users);

    res.status(201).json({ message: "Registrazione completata con successo" });
});

/**
 * Endpoint: POST /api/auth/login
 * Scopo: Verificare le credenziali utente e rilasciare un Token JWT per l'autenticazione.
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validazione base
    if (!username || !password) {
        return res.status(400).json({ error: "Username e password sono richiesti" });
    }

    const users = getUsers();

    // Cerca un record utente che corrisponda esattamente sia all'username che alla password inseriti
    const user = users.find(u => u.username === username && u.password === password);

    // Se l'utente non esiste o la password è sbagliata, userà undefined
    if (!user) {
        // HTTP 401: Unauthorized (Non Autorizzato/Credenziali errate)
        return res.status(401).json({ error: "Credenziali non valide" });
    }

    // GENERAZIONE DEL TOKEN JWT (JSON Web Token)
    // Il token è diviso in 3 parti: Header, Payload (i dati che passiamo noi), e Signature (Firma di sicurezza)
    // Stiamo mettendo 'id' e 'username' nel "Payload" del token.
    const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: '1h' } // Il token scadrà (diventerà invalido) automaticamente dopo 1 ora
    );

    // Invia al client la risposta. Il client salverà questo token
    // e lo invierà nelle richieste successive per "dimostrare" di essere loggato.
    res.json({ message: "Login effettuato", token: token, username: user.username });
});

module.exports = router;
