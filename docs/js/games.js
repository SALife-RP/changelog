// Game manager class to handle different games
class GamesManager {
    constructor() {
        this.currentGame = null;
        this.currentBet = 0;
        this.characterId = null;
        this.isRolling = false;
    }

    initialize(gameData) {
        this.gameData = gameData;
    }

    generateContainer(characterId, cash) {
        return `
            <div class="games-container">
                <h3>Games</h3>
                <div class="game-options">
                    <!--<div class="game-option" onclick="window.gamesManager.startGame('coinflip', ${characterId})">
                        <i class="fas fa-coins"></i>
                        <span>Coinflip</span>
                        <p>50/50 chance to double your money</p>
                    </div>-->
                    <div class="game-option" onclick="window.gamesManager.startGame('dice', ${characterId})">
                        <i class="fas fa-dice"></i>
                        <span>Dice Roll</span>
                        <p>Roll 4 or higher to win</p>
                    </div>
                </div>
            </div>
        `;
    }

    async startGame(gameType, characterId) {
        this.currentGame = gameType;
        this.characterId = characterId;

        const modal = document.createElement("div");
        modal.className = "game-modal";
        modal.innerHTML = this.generateGameModal(gameType);
        document.body.appendChild(modal);

        // Add fade-in animation
        setTimeout(() => modal.classList.add("active"), 10);
    }

    generateGameModal(gameType) {
        return `
            <div class="game-modal-content">
                <h2>${gameType === "coinflip" ? "Coinflip" : "Dice Roll"}</h2>
                ${gameType === "dice" ? this.generateDiceDisplay() : ""}
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

    generateDiceDisplay() {
        return `
            <div class="dice-container">
                <div class="dice" id="dice">
                    <div class="dice-face front">⚀</div>
                    <div class="dice-face back">⚁</div>
                    <div class="dice-face right">⚂</div>
                    <div class="dice-face left">⚃</div>
                    <div class="dice-face top">⚄</div>
                    <div class="dice-face bottom">⚅</div>
                </div>
            </div>
        `;
    }

    adjustBet(amount) {
        const input = document.getElementById("betAmount");
        let newValue = parseInt(input.value) + amount;
        newValue = Math.max(100, Math.min(10000, newValue));
        input.value = newValue;
    }

    async playGame() {
            if (this.isRolling) return;
            this.isRolling = true;

            const betAmount = parseInt(document.getElementById("betAmount").value);
            const resultDiv = document.getElementById("gameResult");
            const diceElement = document.getElementById("dice");

            try {
                if (this.currentGame === "dice") {
                    // Start dice animation
                    diceElement.classList.add("rolling");
                }

                const response = await fetch("/.netlify/functions/play-game", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        gameType: this.currentGame,
                        betAmount: betAmount,
                        characterId: this.characterId,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    if (this.currentGame === "dice") {
                        // Extract the roll number from the message
                        const roll = parseInt(result.message.match(/\d+/)[0]);

                        // Stop rolling animation after 2 seconds and show result
                        setTimeout(() => {
                                    diceElement.classList.remove("rolling");
                                    // Set final rotation based on roll result
                                    this.setDiceFace(diceElement, roll);

                                    // Show result message after dice stops
                                    setTimeout(() => {
                                                resultDiv.innerHTML = `
                                <div class="result ${
                                  result.won ? "win" : "lose"
                                }">
                                    Rolled ${roll} - ${
                result.won ? "You won!" : "You lost!"
              }<br>
                                    ${
                                      result.won
                                        ? `Won: $${result.winAmount}`
                                        : `Lost: $${betAmount}`
                                    }
                                </div>
                            `;
              this.isRolling = false;
            }, 500);
          }, 2000);
        } else {
          resultDiv.innerHTML = `
                        <div class="result ${result.won ? "win" : "lose"}">
                            ${result.message}<br>
                            ${
                              result.won
                                ? `Won: $${result.winAmount}`
                                : `Lost: $${betAmount}`
                            }
                        </div>
                    `;
          this.isRolling = false;
        }

        // Refresh game data after a delay
        setTimeout(() => {
          refreshGameData();
          this.closeGame();
        }, 4000);
      } else {
        resultDiv.innerHTML = `<div class="error">${result.message}</div>`;
        this.isRolling = false;
      }
    } catch (error) {
      resultDiv.innerHTML =
        '<div class="error">Error playing game. Please try again.</div>';
      this.isRolling = false;
    }
  }

  setDiceFace(diceElement, roll) {
    // Define rotations for each face
    const rotations = {
      1: "rotateX(0deg) rotateY(0deg)", // Front face (⚀)
      2: "rotateX(0deg) rotateY(180deg)", // Back face (⚁)
      3: "rotateX(0deg) rotateY(90deg)", // Right face (⚂)
      4: "rotateX(0deg) rotateY(-90deg)", // Left face (⚃)
      5: "rotateX(90deg) rotateY(0deg)", // Top face (⚄)
      6: "rotateX(-90deg) rotateY(0deg)", // Bottom face (⚅)
    };

    diceElement.style.transform = rotations[roll];
  }

  closeGame() {
    const modal = document.querySelector(".game-modal");
    if (modal) {
      modal.classList.remove("active");
      setTimeout(() => modal.remove(), 300);
    }
  }
}

// Initialize games manager
window.gamesManager = new GamesManager();