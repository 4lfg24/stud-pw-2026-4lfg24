document.addEventListener('DOMContentLoaded', async () => {
    const tableContainer = document.getElementById('scores-table-container');
    const token = localStorage.getItem('auth_token');

    // Se l'utente non è loggato, reindirizza al login
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const bestScores = await API.getBestScores();
        
        if (bestScores.length === 0) {
            tableContainer.innerHTML = '<p style="text-align:center;">Non hai ancora completato nessun quiz.</p>';
            return;
        }

        let tableHTML = `
            <table class="scores-table">
                <thead>
                    <tr>
                        <th>Nome Quiz</th>
                        <th>Punteggio Migliore</th>
                    </tr>
                </thead>
                <tbody>
        `;

        bestScores.forEach(score => {
            tableHTML += `
                <tr>
                    <td>${score.quizTitle}</td>
                    <td><span class="score-badge">${score.bestScore} / ${score.total}</span></td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;
        
        tableContainer.innerHTML = tableHTML;
        
    } catch (err) {
        tableContainer.innerHTML = '<p style="color:var(--danger); text-align:center;">Errore nel caricamento dei punteggi.</p>';
    }
});
