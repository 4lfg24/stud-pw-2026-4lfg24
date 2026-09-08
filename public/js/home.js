/**
 * js/home.js
 * Gestisce l'interfaccia utente (UI) e la logica della Home Page, in particolare
 * il caricamento asincrono della griglia dei quiz e la gestione visiva degli stati.
 */
document.addEventListener('DOMContentLoaded', () => {

    // 1. RIFERIMENTI AL DOM: "Agganciamo" gli elementi HTML tramite i loro ID
    const loadingState = document.getElementById('loading-state'); // Spinner
    const errorState = document.getElementById('error-state');     // Banner errore (es. server offline)
    const emptyState = document.getElementById('empty-state');     // Nessun quiz nel DB
    const quizGrid = document.getElementById('quiz-grid');         // Container in cui inietteremo le card
    const retryBtn = document.getElementById('retry-btn');         // Bottone per riprovare in caso di errore

    /**
     * Funzione di utilità per nascondere tutti gli "stati" contemporaneamente, 
     * aggiungendo la classe CSS "hidden" (che ha display: none).
     * Serve per resettare l'interfaccia prima di mostrare lo stato appropriato.
     */
    const hideAllStates = () => {
        loadingState.classList.add('hidden');
        errorState.classList.add('hidden');
        emptyState.classList.add('hidden');
        quizGrid.classList.add('hidden');
    };

    /**
     * Funzione asincrona che coordina la richiesta dei dati e l'aggiornamento dell'UI.
     */
    const loadQuizzes = async () => {
        // Fase 1: Reset UI e mostriamo lo stato "Loading"
        hideAllStates();
        loadingState.classList.remove('hidden'); // così il loader torna visibile

        try {

            const quizzes = await API.getQuizzes();

            hideAllStates();

            // Valutazione degli stati (successo o lista vuota)
            if (quizzes.length === 0) {
                // Caso: Array vuoto -> Mostriamo lo stato Empty
                emptyState.classList.remove('hidden');
            } else {
                // Caso: Array pieno -> "Disegniamo" l'HTML e mostriamo la griglia
                renderQuizzes(quizzes);
                quizGrid.classList.remove('hidden');
            }
        } catch (error) {
            // Fase alternativa (Errore): se la rete cade o il server risponde 500, finiamo nel blocco catch!
            hideAllStates();
            errorState.classList.remove('hidden'); // Mostra la UI rossa di errore
        }
    };

    const renderQuizzes = (quizzes) => {
        quizGrid.innerHTML = '';

        // Iteriamo l'array e costruiamo le card una ad una
        quizzes.forEach(quiz => {
            const card = document.createElement('div');
            card.className = 'quiz-card'; // Assegniamo la classe CSS definita in style.css

            card.innerHTML = `
                <h3>${quiz.title}</h3>
                <p>${quiz.description}</p>
                <a href="quiz.html?id=${quiz.id}" class="btn">Inizia Quiz (${quiz.questionCount} dom.)</a>
            `;

            // Aggiungiamo la card appena creata come "figlio" della griglia HTML principale
            quizGrid.appendChild(card);
        });
    };

    // Associa un ascoltatore di eventi al tasto "Riprova": al 'click', esegui nuovamente loadQuizzes
    retryBtn.addEventListener('click', loadQuizzes);

    // Boot dell'applicazione: Eseguiamo immediatamente il caricamento iniziale appena la pagina è pronta
    loadQuizzes();
});
