class GamesManager {
    constructor() {
        this.currentBalance = 0;
        this.currentBet = 0;
        this.minBet = 100;
        this.maxBet = 100000;
        this.games = {
            coinflip: {
                name: 'Coinflip',
                description: 'Double your money with 50/50 odds',
                minBet: 100,
                maxBet: 50000,
                multiplier: 2
            },
            dice: {
                name: 'Dice Roll',
                description: 'Roll 4-6 to win (50% odds)',
                minBet: 100,
                maxBet: 75000,
                multiplier: 2
            },
            slots: {
                name: 'Slots',
                description: 'Match symbols to win up to 100x',
                minBet: 100,
                maxBet: 10000,
                multiplier: {
                    triple7: 100,
                    tripleBar: 50,
                    tripleCherries: 25,
                    anyTriple: 10,
                    anyPair: 2
                }
            }
        };
    }

    async initialize() {
        try {
            // Fetch player's current balance
            const response = await fetch('/.netlify/functions/get-balance', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch balance');

            const data = await response.json();
            this.currentBalance = data.balance;
            this.renderGamesUI();
        } catch (error) {
            console.error('Failed to initialize games:', error);
            return false;
        }
    }

    setBet(amount) {
        amount = parseInt(amount);
        if (isNaN(amount) || amount < this.minBet || amount > this.maxBet) {
            alert(`Bet must be between $${this.minBet} and $${this.maxBet}`);
            return false;
        }
        if (amount > this.currentBalance) {
            alert('Insufficient funds');
            return false;
        }
        this.currentBet = amount;
        return true;
    }

    async playCoinflip() {
        if (!this.validateBet()) return;

        try {
            const response = await fetch('/.netlify/functions/play-game', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    game: 'coinflip',
                    bet: this.currentBet
                })
            });

            const result = await response.json();
            if (result.success) {
                this.currentBalance = result.newBalance;
                this.updateBalance();
                this.showGameResult('coinflip', result);
            }
        } catch (error) {
            console.error('Game error:', error);
            alert('Failed to process game. Please try again.');
        }
    }

    // Add similar methods for dice and slots...

    validateBet() {
        if (!this.currentBet || this.currentBet < this.minBet) {
            alert(`Minimum bet is $${this.minBet}`);
            return false;
        }
        if (this.currentBet > this.currentBalance) {
            alert('Insufficient funds');
            return false;
        }
        return true;
    }

    showGameResult(game, result) {
            const resultContainer = document.getElementById('gameResult');
            resultContainer.innerHTML = `
            <div class="game-result ${result.won ? 'win' : 'loss'}">
                <h3>${result.won ? 'You Won!' : 'You Lost'}</h3>
                <p>Amount: ${result.won ? '+' : '-'}$${result.amount}</p>
                ${result.details ? `<p>${result.details}</p>` : ''}
                <p>New Balance: $${this.currentBalance}</p>
            </div>
        `;
    }

    generateContainer() {
        return `
            <div class="games-section">
                <div class="games-header">
                    <h2>Casino Games</h2>
                    <div class="balance-display">
                        Balance: $${this.currentBalance}
                    </div>
                </div>

                <div class="bet-controls">
                    <input type="number"
                           id="betAmount"
                           min="${this.minBet}"
                           max="${this.maxBet}"
                           value="${this.minBet}"
                           onchange="window.gamesManager.setBet(this.value)">
                    <div class="quick-bet-buttons">
                        <button onclick="window.gamesManager.setBet(${this.minBet})">Min</button>
                        <button onclick="window.gamesManager.setBet(Math.floor(this.currentBalance * 0.1))">10%</button>
                        <button onclick="window.gamesManager.setBet(Math.floor(this.currentBalance * 0.5))">50%</button>
                        <button onclick="window.gamesManager.setBet(this.currentBalance)">Max</button>
                    </div>
                </div>

                <div class="games-grid">
                    ${Object.entries(this.games).map(([id, game]) => `
                        <div class="game-card">
                            <h3>${game.name}</h3>
                            <p>${game.description}</p>
                            <button onclick="window.gamesManager.play${id.charAt(0).toUpperCase() + id.slice(1)}()">
                                Play ${game.name}
                            </button>
                        </div>
                    `).join('')}
                </div>

                <div id="gameResult"></div>
            </div>
        `;
    }
}

// Initialize the games manager globally
window.gamesManager = new GamesManager();