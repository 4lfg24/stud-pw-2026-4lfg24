
const express = require('express');

// Importiamo 'cors' per permettere richieste da domini/porte diverse (Cross-Origin Resource Sharing)
const cors = require('cors');

const path = require('path');

const quizzesRoutes = require('./routes/quizzes');
const scoresRoutes = require('./routes/scores');
const authRoutes = require('./routes/auth');

// Inizializziamo l'applicazione Express
const app = express();

// Definiamo la porta su cui il server ascolterà le richieste.
// Usa la porta definita nelle variabili d'ambiente (process.env.PORT) se esiste, altrimenti usa la 3000 di default.
const PORT = process.env.PORT || 3000;

/* ================= MIDDLEWARE ================= */
app.use(cors()); // Abilita CORS per tutte le rotte

// Middleware fondamentale: fa il "parsing" del corpo delle richieste in formato JSON.
// Senza questo, non potremmo leggere i dati inviati dal frontend (es. req.body nel salvataggio punteggio).
app.use(express.json()); 

// Middleware per servire i file statici (HTML, CSS, JS lato client, immagini).
// Dice a Express: "Qualsiasi file venga richiesto che si trova nella cartella 'public', invialo direttamente al client".
app.use(express.static(path.join(__dirname, 'public'))); 


/* ================= API ROUTES ================= */
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/scores', scoresRoutes);
app.use('/api/auth', authRoutes);


/* ================= GESTIONE ERRORI ================= */

// Middleware di Fallback (Gestione 404 - Not Found)
app.use((req, res, next) => {
    res.status(404).json({ error: "Endpoint API non trovato" });
});

// Middleware Globale di Gestione Errori (Status 500)
// Viene richiamato automaticamente da Express se lanciamo un'eccezione (throw) in una rotta
// o passiamo un errore alla funzione next(err).
app.use((err, req, res, next) => {
    console.error("Errore di sistema:", err.stack);
    res.status(500).json({ error: "Errore interno del server" });
});


/* ================= AVVIO SERVER ================= */
app.listen(PORT, () => {
    console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
    console.log(`Apri http://localhost:${PORT} nel tuo browser per visualizzare l'app.`);
});
