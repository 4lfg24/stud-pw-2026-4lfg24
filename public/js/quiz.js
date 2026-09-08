/**
 * js/quiz.js
 * Core logic dell'applicazione per l'utente (Svolgimento del Quiz).
 * Gestisce l'estrazione dei parametri URL, il cronometro a decremento, 
 * l'avanzamento delle domande, e l'invio finale del risultato al server.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- ESTARZIONE QUERY STRING ---
    // Leggiamo i parametri dall'URL della pagina (es: /quiz.html?id=2)
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id'); // Estrae il valore associato alla chiave 'id'

    // Se l'utente tenta di accedere a quiz.html senza un ID valido, lo rimandiamo alla home.
    if (!quizId) {
        window.location.href = 'index.html';
        return; // Interrompe l'esecuzione del codice sottostante
    }

    // --- DIZIONARIO UI ---
    // Raduno tutti i selettori del DOM così da averli a portata
    const UI = {
        loading: document.getElementById('loading-state'),
        error: document.getElementById('error-state'),
        interface: document.getElementById('quiz-interface'),
        result: document.getElementById('result-interface'),

        title: document.getElementById('quiz-title'),
        timer: document.getElementById('timer'),
        progressBar: document.getElementById('progress-bar'),

        currentQNum: document.getElementById('current-q-num'),
        totalQNum: document.getElementById('total-q-num'),
        questionText: document.getElementById('question-text'),
        optionsGrid: document.getElementById('options-grid'),

        finalScore: document.getElementById('final-score'),
        finalTotal: document.getElementById('final-total'),
        saveStatus: document.getElementById('save-status')
    };

    //variabili di "stato" del singolo quiz che sta svolgendo l'utente
    let quizData = null; // Conterrà l'intero oggetto JSON del quiz
    let currentQuestionIndex = 0; // Indice dell'array (0 = prima domanda)
    let score = 0; // Punteggio cumulato
    let timerInterval = null; // Riferimento all'ID restituito da setInterval (necessario per poterlo fermare)
    let timeLeft = 30; // Tempo di default in secondi per rispondere a una domanda

    // Funzione helper per pulire l'interfaccia
    const hideAll = () => {
        UI.loading.classList.add('hidden');
        UI.error.classList.add('hidden');
        UI.interface.classList.add('hidden');
        UI.result.classList.add('hidden');
    };

    /**
     * Fase Iniziale: Scarica le domande del quiz dal backend.
     */
    const loadQuiz = async () => {
        hideAll();
        UI.loading.classList.remove('hidden');

        try {
            // Chiamiamo la rotta backend (GET /api/quizzes/:id) tramite il nostro file api.js
            quizData = await API.getQuizById(quizId);

            // Popoliamo l'intestazione statica e l'UI
            hideAll();
            UI.interface.classList.remove('hidden');
            UI.title.textContent = quizData.title;
            UI.totalQNum.textContent = quizData.questions.length;
            //mostriamo la prima domanda
            showQuestion();
        } catch (error) {
            hideAll();
            UI.error.classList.remove('hidden');
        }
    };

    /**
     * Disegna i contenuti della domanda corrente nello schermo utente.
     */
    const showQuestion = () => {
        // Recuperiamo i dati della domanda corrente dall'array 'questions'
        const question = quizData.questions[currentQuestionIndex];

        UI.currentQNum.textContent = currentQuestionIndex + 1; //passiamo alla domanda successiva
        UI.questionText.textContent = question.text;

        //Logica progress bar (numero di domande a cui l'utente ha risposto)
        const progress = ((currentQuestionIndex) / quizData.questions.length) * 100;
        UI.progressBar.style.width = `${progress}%`; // modifica dele proprietà CSS

        //Puliamo le opzioni di risposta precedenti
        UI.optionsGrid.innerHTML = '';

        const labels = ['A', 'B', 'C', 'D'];

        // Cicliamo sull'array delle opzioni della domanda
        question.options.forEach((opt, index) => {
            const card = document.createElement('div');
            card.className = 'option-card';

            const imgSrc = opt.image ? `assets/images/${opt.image}` : `https://via.placeholder.com/150?text=Immagine+${labels[index]}`;

            card.innerHTML = `
                <img src="${imgSrc}" class="option-img" alt="Opzione ${labels[index]}" onerror="this.src='https://via.placeholder.com/150?text=N/A'">
                <div class="option-label">${labels[index]}</div>
            `;


            // GESTIONE EVENTI DOM: 
            // Quando l'utente clicca su una risposta, viene confrontato il suo id con quello della risposta corretta
            card.addEventListener('click', () => handleAnswer(opt.id, question.correctOption));

            // Appende l'elemento creato
            UI.optionsGrid.appendChild(card);
        });

        // Appena finiamo di stampare la domanda sul display, avviamo il conto alla rovescia
        startTimer();
    };


    //Cronometro che viene avviato all'inizio di ogni domanda

    const startTimer = () => {
        // clearInterval stoppa eventuali timer residui della domanda precedente, prevenendo errori di sovrapposizione.
        clearInterval(timerInterval);
        timeLeft = 30; // Reset a 30 sec
        updateTimerDisplay(); // Forziamo l'aggiornamento visivo immediato a 00:30

        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                // TEMPO SCADUTO!
                clearInterval(timerInterval);
                // Forzo la risposta. Passare null al posto di selectedId garantirà che l'utente perda il punto per la domanda
                //(forse poi lo cambio e gli passo l'ultimo id selezionato)
                handleAnswer(null, quizData.questions[currentQuestionIndex].correctOption);
            }
        }, 1000);
    };


    //Formatto il tempo rimanente in una stringa "MM:SS"
    const updateTimerDisplay = () => {
        //padStart per impostare la lunghezza a 2 caratteri, con 0 davanti se non c'è un secondo carattere
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        UI.timer.textContent = `${m}:${s}`;
    };

    const handleAnswer = (selectedId, correctId) => {
        // Fermiamo prima il timer per fermare il panico
        clearInterval(timerInterval);

        // Validazione della risposta (se uguali, aggiungi 1 punto)
        if (selectedId === correctId) {
            score++;
        }

        currentQuestionIndex++; //passiamo alla domanda successiva

        // Controllo se ci sono ancora domande
        if (currentQuestionIndex < quizData.questions.length) {
            showQuestion();
        } else {
            finishQuiz();
        }
    };

    /**
     * Chiude la partita e chiama l'API POST per salvare su JSON.
     */
    const finishQuiz = async () => {
        hideAll();
        UI.result.classList.remove('hidden'); // Schermata Riepilogo

        const total = quizData.questions.length;

        // Stampa i risultati calcolati nell'HTML
        UI.finalScore.textContent = score;
        UI.finalTotal.textContent = total;

        // Feedback utente ("loading")
        UI.saveStatus.textContent = 'Salvataggio punteggio...';

        try {
            // Invia payload JSON al Server (Express) tramite API POST
            await API.saveScore({
                quizId: quizData.id,
                score: score,
                total: total
            });
            // Successo: Cambia il testo e il colore via CSS
            UI.saveStatus.textContent = 'Punteggio salvato con successo!';
            UI.saveStatus.style.color = 'var(--success)';
        } catch (error) {
            // Errore: l'api ha dato 400 o 500, oppure la rete è staccata
            UI.saveStatus.textContent = 'Errore nel salvataggio del punteggio.';
            UI.saveStatus.style.color = 'var(--danger)';
        }
    };

    loadQuiz();
});
