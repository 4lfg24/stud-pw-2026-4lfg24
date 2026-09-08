/**
 * middlewares/authMiddleware.js
 * Questo file definisce un "Middleware" custom per proteggere le rotte di Express.
 * Il suo compito è intercettare la richiesta HTTP prima che arrivi alla funzione della rotta,
 * estrarre il token JWT dall'intestazione, validarlo e bloccare l'accesso se invalido.
 */

const jwt = require('jsonwebtoken');

// Chiave Segreta usata per firmare e validare i token.
const SECRET_KEY = 'super_secret_key_per_esame_pw';


const verifyToken = (req, res, next) => {
    // 1. Estrae l'header "Authorization" dalla richiesta HTTP.
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: "Accesso negato. Token mancante." });
    }

    // 2. Il formato standard è "Bearer <il_tuo_token_molto_lungo>".
    // Quindi splittiamo lo spazio e prendiamo il secondo elemento.
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Formato token non valido." });
    }

    // 3. Prova a verificare il token usando la chiave segreta
    try {
        // La funzione verify lancia un'eccezione (error) se il token è falso, manipolato o scaduto
        const decoded = jwt.verify(token, SECRET_KEY);

        // Se la decodifica ha successo, iniettiamo le informazioni dell'utente direttamente nell'oggetto `req`.
        // In questo modo, le rotte successive potranno usare ad es. `req.user.username`.
        req.user = decoded;

        next();
    } catch (err) {
        // Codice 403: Forbidden (vietato). 
        return res.status(403).json({ error: "Token non valido o scaduto." });
    }
};

module.exports = { verifyToken, SECRET_KEY };
