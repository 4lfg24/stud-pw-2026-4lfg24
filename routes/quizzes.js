/**
 * routes/quizzes.js
 * Questo file gestisce tutte le richieste API (endpoint) relative all'entità "Quiz".
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const quizzesFilePath = path.join(__dirname, '../data/quizzes.json');

/**
 * Funzione di utilità per leggere il file JSON dei quiz.
 * Usiamo try/catch per evitare che il server crashi se il file non esiste o è corrotto.
 */
const getQuizzes = () => {
    try {
        // readFileSync legge il file in modo sincrono. Si potrebbe usare fs.promise, ma il file è piccolo quindi dovrebbe andare bene.
        const data = fs.readFileSync(quizzesFilePath, 'utf8');
        return JSON.parse(data); // Converte la stringa JSON in un array di oggetti JavaScript
    } catch (err) {
        console.error("Errore nella lettura dei quiz:", err);
        return [];
    }
};

/**
 * Endpoint: GET /api/quizzes
 * Scopo: Restituire la lista di tutti i quiz disponibili da mostrare nella Home Page.
 * Nota: Restituiamo solo i "metadati" (titolo, descrizione) per non sovraccaricare la rete
 * inviando anche tutte le domande (che non servono in home page).
 */
router.get('/', (req, res) => {
    const quizzes = getQuizzes();

    // Usiamo il metodo map degli array per creare un nuovo array di oggetti alleggeriti
    const quizzesList = quizzes.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description,
        questionCount: q.questions.length // Calcoliamo quante domande ci sono nel quiz
    }));

    // Invia la risposta al client in formato JSON (invia in automatico lo status 200 OK)
    res.json(quizzesList);
});

/**
 * Endpoint: GET /api/quizzes/:id
 * Scopo: Restituire i dettagli completi (incluse le domande) di uno specifico quiz.
 * Il parametro ':id' nell'URL è dinamico e accessibile tramite req.params.id
 */
router.get('/:id', (req, res) => {
    const quizzes = getQuizzes();

    // Cerchiamo nell'array il quiz con l'id corrispondente a quello richiesto nell'URL
    const quiz = quizzes.find(q => q.id === req.params.id);

    // Gestione Errore: Se il quiz non esiste, restituiamo un errore 404 (Not Found)
    if (!quiz) {
        return res.status(404).json({ error: "Quiz non trovato" });
    }

    // Restituiamo il quiz completo trovato (occhio alla cosa della risposta corretta)
    res.json(quiz);
});

module.exports = router;
