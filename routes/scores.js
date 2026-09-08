

//Questo file gestisce le richieste API per salvare e leggere i punteggi dei quiz.

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middlewares/authMiddleware');

const scoresFilePath = path.join(__dirname, '../data/scores.json');

/**
 * Legge il database JSON dei punteggi
 */
const getScores = () => {
    try {
        const data = fs.readFileSync(scoresFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return []; // Se il file non esiste (es. al primo avvio), partiamo da un array vuoto
    }
};


//Salva l'intero array dei punteggi sovrascrivendo il file JSON.

const saveScores = (scores) => {
    // Il parametro "null, 2" formatta il file JSON con indentazione a 2 spazi, rendendolo leggibile
    fs.writeFileSync(scoresFilePath, JSON.stringify(scores, null, 2), 'utf8');
};

/**
 * Endpoint: GET /api/scores
 * Scopo: Ritorna la cronologia di tutti i punteggi
 */
router.get('/', (req, res) => {
    const scores = getScores();
    res.json(scores); // Restituisce l'array dei punteggi
});

/**
 * Endpoint: POST /api/scores
 * Scopo: Salvare un nuovo punteggio completato al termine di un quiz.
 */
router.post('/', (req, res) => {
    // Estraiamo (Destructuring) i dati dal corpo della richiesta (req.body)
    const { quizId, score, total } = req.body;

    // VALIDAZIONE LATO SERVER (MOLTO IMPORTANTE PER L'ESAME)
    // Controlliamo che il client ci abbia mandato tutti i dati necessari.
    // Usiamo '!== undefined' perché 'score' potrebbe essere '0', e !0 è valutato come 'true' (falso positivo in javascript).
    if (!quizId || score === undefined || total === undefined) {
        // Se i dati mancano o sono errati, blocchiamo la richiesta con uno status 400 (Bad Request)
        return res.status(400).json({ error: "Dati invalidi: mancano parametri per salvare il punteggio" });
    }

    const scores = getScores();

    // Creiamo il nuovo oggetto punteggio
    const newScore = {
        id: Date.now().toString(), // Generiamo un ID univoco basato sul timestamp attuale
        username: "Anonimo",       // Hardcoded per MVP. In futuro sarà: req.user.username (fornito dal JWT)
        quizId: quizId,
        score: score,
        total: total,
        date: new Date().toISOString() // Salviamo la data e ora in formato stringa standard ISO
    };

    // Aggiungiamo il nuovo record all'array esistente
    scores.push(newScore);

    // Salviamo l'array aggiornato sul file system
    saveScores(scores);

    // Rispondiamo al client con status 201 (Created) e i dati appena creati
    res.status(201).json(newScore);
});

module.exports = router;
