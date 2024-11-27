function displayCharacterInfo() {
    if (!gameData) {
        return '<div class="no-characters">Loading player data...</div>';
    }

    if (!gameData.characters || gameData.characters.length === 0) {
        return '<div class="no-characters">No characters found</div>';
    }

    let html = '<div class="characters-section">';
    html += '<h2>Your Characters</h2>';

    gameData.characters.forEach((char, index) => {
        // Get the first identity object from the array
        const identity = char.identity[0] || {};
        const money = char.money || [];
        const vehicles = char.vehicles || [];

        // Calculate total money
        const wallet = money.reduce((total, m) => total + (m.wallet || 0), 0);
        const bank = money.reduce((total, m) => total + (m.bank || 0), 0);

        html += `
            <div class="character-card">
                <div class="character-header">
                    <img src="${identity.mdt_image || 'assets/images/placeholder.png'}"
                         alt="Character Image"
                         class="character-image"
                         onerror="this.src='assets/images/placeholder.png'"
                         loading="lazy">
                    <div class="character-title">
                        <h3>${identity.firstname || 'Unknown'} ${identity.name || ''}</h3>
                        <span class="character-details">
                            ${identity.age ? `Age: ${identity.age}` : ''} ${identity.sex ? `| Sex: ${identity.sex}` : ''}
                        </span>
                    </div>
                </div>

                <div class="character-stats">
                    <div class="stat">
                        <span class="stat-label">Phone:</span>
                        <span class="stat-value">${identity.phone || 'N/A'}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Job:</span>
                        <span class="stat-value">${identity.job || 'Unemployed'} ${identity.jobrank ? `(Rank ${identity.jobrank})` : ''}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Nationality:</span>
                        <span class="stat-value">${identity.nationality || 'Unknown'}</span>
                    </div>
                    <div class="stat money-stat">
                        <span class="stat-label">Wallet:</span>
                        <span class="stat-value">$${wallet.toLocaleString()}</span>
                    </div>
                    <div class="stat money-stat">
                        <span class="stat-label">Bank:</span>
                        <span class="stat-value">$${bank.toLocaleString()}</span>
                    </div>
                </div>

                ${vehicles.length > 0 ? `
                    <div class="character-vehicles">
                        <h4>Vehicles (${vehicles.length})</h4>
                        <div class="vehicles-grid">
                            ${vehicles.map(vehicle => `
                                <div class="vehicle-card">
                                    <img src="${vehicle.mdt_image || 'assets/images/placeholder.png'}"
                                         alt="Vehicle Image"
                                         class="vehicle-image"
                                         onerror="this.src='assets/images/placeholder.png'"
                                         loading="lazy">
                                    <div class="vehicle-info">
                                        <span class="vehicle-name">${vehicle.vehicle?.toUpperCase() || 'Unknown Vehicle'}</span>
                                        <span class="vehicle-plate">${vehicle.vehicle_plate || 'No Plate'}</span>
                                        <span class="vehicle-vin">VIN: ${vehicle.vehicle_vin || 'Unknown'}</span>
                                        <div class="vehicle-stats">
                                            <span>Insurance: ${vehicle.insurance || 0}%</span>
                                            <span>Lives: ${vehicle.lives || 0}</span>
                                            <span>Odometer: ${(vehicle.odometer || 0).toLocaleString()} mi</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : '<div class="no-vehicles">No vehicles owned</div>'}
            </div>
        `;
    });

    html += '</div>';
    return html;
}

