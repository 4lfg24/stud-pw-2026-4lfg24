# Contesto Progetto: MycoQuiz (Esame di Programmazione Web)

## 1. Dettagli Esame
- **Corso:** Programmazione Web (Sapienza / Tor Vergata)
- **Docenti:** Prof. Loreti, Prof. Bracciale
- **Requisiti chiave:** Node.js, Express, Frontend Vanilla JS (HTML/CSS), Fetch API async/await, REST API, gestione degli stati UI, commit Git progressivi, e documento di specifiche `specifiche/specifiche_progetto.md`.

## 2. Idea di Progetto: MycoQuiz
- **Descrizione:** Piattaforma web interattiva per quiz a risposta multipla su riconoscimento e studio dei funghi (ispirato a mushroom.world).
- **Design Home:** Layout con Header, Navbar Sticky, introduzione e griglia di Card responsive (CSS Grid/Flexbox) per la selezione dei quiz.

## 3. Architettura Tecnica
- **Frontend:** HTML semantico, CSS responsive, Vanilla JS modulare. Gestione visiva di caricamento, errori e lista vuota.
- **Backend:** Node.js + Express.
- **Rotte REST previste:**
  - `GET /api/quizzes` (lista quiz per la Home)
  - `GET /api/quizzes/:id` (dettaglio domande quiz)
  - `POST /api/scores` (salvataggio punteggio)
  - `POST /api/login` & `POST /api/register` (autenticazione extra con JWT)
- **Middleware:** `express.json()`, `express.static('public')`, e middleware custom `verifyToken` per le rotte protette.

## 4. File già generati nella chat
- `specifiche/specifiche_progetto.md` (Documento di specifiche formale pronto per il repository).
- Script di riferimento su concetti del corso: `javascript_fondamentali.js`, `javascript_asincrono_promises.js`, `javascript_fetch_async_cors.js`, `express_middleware_mvc.js`, `express_ssr_ejs.js`, `express_auth_jwt.js`.