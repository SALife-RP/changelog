// Game manager class to handle different games
class GamesManager {
    constructor() {
        this.currentGame = null;
        this.currentBet = 0;
        this.characterId = null;
    }

    initialize(gameData) {
        this.gameData = gameData;
    }

    generateContainer(characterId, cash) {
        return `
            <div class="games-container">
                <h3>Games</h3>
                <div class="game-options">
                    <div class="game-option" onclick="window.gamesManager.startGame('coinflip', ${characterId})">
                        <i class="fas fa-coins"></i>
                        <span>Coinflip</span>
                        <p>50/50 chance to double your money</p>
                    </div>
                    <div class="game-option" onclick="window.gamesManager.startGame('dice', ${characterId})">
                        <i class="fas fa-dice"></i>
                        <span>Dice Roll</span>
                        <p>Roll 7 or higher to win</p>
                    </div>
                </div>
            </div>
        `;
    }

    async startGame(gameType, characterId) {
        this.currentGame = gameType;
        this.characterId = characterId;

        const modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.innerHTML = this.generateGameModal(gameType);
        document.body.appendChild(modal);

        // Add fade-in animation
        setTimeout(() => modal.classList.add('active'), 10);
    }

    generateGameModal(gameType) {
        return `
            <div class="game-modal-content">
                <h2>${gameType === 'coinflip' ? 'Coinflip' : 'Dice Roll'}</h2>
                <div class="bet-controls">
                    <label>Bet Amount:</label>
                    <input type="number" id="betAmount" min="100" max="10000" step="100" value="100">
                    <div class="bet-buttons">
                        <button onclick="window.gamesManager.adjustBet(-100)">-100</button>
                        <button onclick="window.gamesManager.adjustBet(100)">+100</button>
                    </div>
                </div>
                <div class="game-controls">
                    <button class="play-button" onclick="window.gamesManager.playGame()">Play</button>
                    <button class="cancel-button" onclick="window.gamesManager.closeGame()">Cancel</button>
                </div>
                <div id="gameResult" class="game-result"></div>
            </div>
        `;
    }

    adjustBet(amount) {
        const input = document.getElementById('betAmount');
        let newValue = parseInt(input.value) + amount;
        newValue = Math.max(100, Math.min(10000, newValue));
        input.value = newValue;
    }

    async playGame() {
            const betAmount = parseInt(document.getElementById('betAmount').value);
            const resultDiv = document.getElementById('gameResult');

            try {
                const response = await fetch('/.netlify/functions/play-game', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        gameType: this.currentGame,
                        betAmount: betAmount,
                        characterId: this.characterId
                    })
                });

                const result = await response.json();

                if (result.success) {
                    resultDiv.innerHTML = `
                    <div class="result ${result.won ? 'win' : 'lose'}">
                        ${result.message}<br>
                        ${result.won ? `Won: $${result.winAmount}` : `Lost: $${betAmount}`}
                    </div>
                `;

                // Refresh game data after a short delay
                setTimeout(() => {
                    refreshGameData();
                    this.closeGame();
                }, 2000);
            } else {
                resultDiv.innerHTML = `<div class="error">${result.message}</div>`;
            }
        } catch (error) {
            resultDiv.innerHTML = '<div class="error">Error playing game. Please try again.</div>';
        }
    }

    closeGame() {
        const modal = document.querySelector('.game-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }
}

// Initialize games manager
window.gamesManager = new GamesManager();