# Documento di Specifiche: MycoQuiz

## 1. Obiettivo dell'applicazione
L'applicazione, denominata "MycoQuiz", è una piattaforma web interattiva progettata per testare e migliorare le conoscenze in ambito micologico. Risolve il problema dell'apprendimento teorico e mnemonico delle specie fungine, trasformandolo in un'esperienza ludica e coinvolgente. È rivolta ad appassionati di natura, raccoglitori dilettanti e chiunque abbia interesse a mettere alla prova le proprie conoscenze in ambito micologico.

## 2. Cosa può fare l'utente
- **Registrazione e Autenticazione:** Creare un account personale e accedere in modo sicuro.
- **Esplorazione Quiz:** Sfogliare un catalogo di quiz tematici (es. "Riconoscimento Boleti", "Funghi Velenosi vs Commestibili").
- **Svolgimento del Quiz:** Rispondere a domande a scelta multipla, visualizzando immagini delle specie e ricevendo un feedback immediato a fine partita.
- **Salvataggio Punteggio:** Memorizzare i risultati ottenuti nel proprio profilo per tracciare i progressi nel tempo.

## 3. Struttura del frontend
L'interfaccia si dividerà in tre sezioni principali:
- **Home Page (Dashboard):** Presenta un Header con immagine a tema, una Navbar *sticky* per la navigazione e un testo introduttivo. Il cuore della pagina è una griglia responsive di *Card*, ognuna rappresentante un quiz disponibile.
- **Pagina del Quiz:** Una volta cliccata una Card, l'utente entra in un'interfaccia dedicata dove visualizza la singola domanda, le possibili risposte e un indicatore di progresso. Include la gestione visiva degli stati (es. caricamento delle domande).
- **Area Personale/Auth:** Form per il login e la registrazione con validazione degli input in tempo reale, oltre a un pannello riassuntivo dei punteggi salvati.

## 4. Mockup minimale
Il design di base della Home Page segue lo schema allegato (`home_mockup.jpg`):
- **Header:** Immagine e Testo descrittivo centrati in alto.
- **Navbar:** Barra di navigazione in modalità *sticky* subito sotto l'header.
- **Corpo:** Un'intestazione con testo introduttivo, seguita da un contenitore flessibile (CSS Grid/Flexbox) che ospita le "Card" con i titoli dei vari quiz allineate orizzontalmente.
- **Footer:** Chiusura a fondo pagina.

## 5. Scenari di test
- **Test 1 - Registrazione con dati non validi:** L'utente invia il form di registrazione lasciando la password vuota. L'applicazione deve mostrare un messaggio di errore visivo sotto l'input (validazione lato client). In caso di bypass forzato, il server deve rispondere con un errore 400 gestito tramite un avviso nell'interfaccia (validazione lato server).
- **Test 2 - Login e accesso a rotta protetta:** L'utente inserisce credenziali valide. Si aspetta un messaggio di successo, la memorizzazione del token (JWT) e l'aggiornamento della navbar che sbloccherà le azioni autenticate (es. salvataggio punteggio).
- **Test 3 - Rete Assente durante il caricamento:** L'utente clicca su un quiz. Durante la fase di caricamento, viene simulata l'assenza di rete tramite DevTools. Il frontend deve intercettare l'errore `fetch` e mostrare un'interfaccia dedicata: "Impossibile caricare le domande. Controlla la tua connessione".
- **Test 4 - Visualizzazione Lista Vuota:** Se il server risponde con un array vuoto (0 quiz disponibili), la Home Page non deve generare errori, ma mostrare un messaggio amichevole: "Nessun quiz attualmente disponibile, torna più tardi!".
