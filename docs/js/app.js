// Main application logic
let currentView = 'features';
let currentVehicle = null;
let userInfo = null;
let pendingAction = null;
let currentPage = 1;
const charactersPerPage = 14;
let sortedIdentities = null;
let sortedVehicles = null;
let currentUser = null;
let gameData = null;

// Add these functions at the top level
function showLoadingScreen() {
    document.getElementById('loadingScreen').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideLoadingScreen() {
    document.getElementById('loadingScreen').classList.remove('active');
    document.body.style.overflow = '';
}

async function loadContent(filename) {
    try {
        if (filename === 'server') {
            await loadServerInfo();
            return;
        }

        const response = await fetch(filename + '.md');
        const text = await response.text();
        const parsedContent = marked.parse(text);

        // Process image tags with error handling
        const processedContent = parsedContent.replace(
            /@image\((.*?)\)/g,
            (match, imagePath) => {
                return `
                    <div class="image-container">
                        <img
                            class="feature-image"
                            src="assets/images/${imagePath}"
                            alt="Feature Image"
                            loading="lazy"
                            onerror="this.onerror=null; this.src='assets/images/placeholder.png';"
                        >
                    </div>
                `;
            }
        );

        document.getElementById('content').innerHTML = processedContent;

        // Add lightbox functionality to images
        document.querySelectorAll('.feature-image').forEach(img => {
            img.onclick = function() {
                if (this.src !== 'assets/images/logo.png') {
                    this.requestFullscreen();
                }
            };
        });
    } catch (error) {
        console.error('Error loading content:', error);
        document.getElementById('content').innerHTML =
            '<div class="error-message">Failed to load content. Please try again later.</div>';
    }
}

function switchContent(view) {
    currentView = view;
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');

    switch (view) {
        case 'features':
            loadContent('FEATURES');
            break;
        case 'changelog':
            loadContent('CHANGELOG');
            break;
        case 'server':
            loadContent('server');
            break;
        case 'profile':
            loadPlayerProfile();
            break;
    }
}

async function loadServerInfo() {
    try {
        const response = await fetch('https://servers-frontend.fivem.net/api/servers/single/zjepzy');
        const data = await response.json();
        const serverData = data.Data;

        // Initialize managers with server data
        await window.vehicleManager.initialize(serverData);
        await window.characterManager.initialize(serverData);

        // Generate server info HTML
        const serverInfoHtml = generateServerInfoHtml(serverData);
        document.getElementById('content').innerHTML = serverInfoHtml;
    } catch (error) {
        console.error('Error loading server info:', error);
        document.getElementById('content').innerHTML = `
            <div class="server-info-container">
                <h1>Server Information</h1>
                <div class="error-message">
                    <p>Unable to load server information.</p>
                    <p>Please join our <a href="https://discord.gg/8VAZb9fc" target="_blank">Discord</a> for server status.</p>
                </div>
            </div>
        `;
    }
}

function generateServerInfoHtml(serverData) {
    return `
        <div class="server-info-container">
            <h1>Server Information</h1>
            ${generateServerStats(serverData)}
            ${generateConnectionInfo()}
            ${window.characterManager.generateContainer()}
            ${window.vehicleManager.generateContainer()}
        </div>
    `;
}

function generateServerStats(serverData) {
    return `
        <div class="server-stats-grid">
            <div class="server-stat-card">
                <h3>Players</h3>
                <div class="stat-value">${serverData.players?.length || 0}/${serverData.svMaxclients || 32}</div>
                <div class="stat-label">Online Players</div>
            </div>
            <div class="server-stat-card">
                <h3>Server Name</h3>
                <div class="stat-value">${serverData.hostname || 'SA Life'}</div>
            </div>
            <div class="server-stat-card">
                <h3>Game Type</h3>
                <div class="stat-value">${serverData.vars?.gametype || 'Roleplay'}</div>
                <div class="stat-label">Game Mode</div>
            </div>
        </div>
    `;
}

function generateConnectionInfo() {
    return `
        <div class="server-connection">
            <h2>Connection Information</h2>
            <div class="connection-details">
                <p><strong>Server:</strong> <code>connect cfx.re/join/zjepzy</code></p>
                <p><strong>Discord:</strong> <a href="https://discord.gg/8VAZb9fc" target="_blank">Join our Community</a></p>
            </div>
        </div>
    `;
}

async function refreshGameData() {
    if (!currentUser || !currentUser.id) return;

    try {
        const response = await fetch('/.netlify/functions/refresh-game-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                discord_id: currentUser.id
            })
        });

        if (!response.ok) throw new Error('Failed to refresh game data');

        const data = await response.json();
        gameData = data;

        // Update localStorage with new game data
        const userData = JSON.parse(localStorage.getItem('user_data'));
        userData.game_data = data;
        localStorage.setItem('user_data', JSON.stringify(userData));

        // If we're on the server info page, refresh the character display
        if (currentView === 'server') {
            displayCharacterInfo();
        }
    } catch (error) {
        console.error('Error refreshing game data:', error);
    }
}

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
                if (!char.identity) {
                    html += `
                <div class="character-card">
                    <div class="character-header">
                        <div class="character-title">
                            <h3>Unknown Character</h3>
                            <span class="character-details">No data available</span>
                        </div>
                    </div>
                </div>
            `;
                    return;
                }

                html += `
            <div class="character-card">
                <div class="character-header">
                    <img src="${char.identity.mdt_image || 'assets/images/placeholder.png'}"
                         alt="Character Image"
                         class="character-image">
                    <div class="character-title">
                        <h3>${char.identity.firstname} ${char.identity.name}</h3>
                        <span class="character-details">
                            Age: ${char.identity.age} | Sex: ${char.identity.sex}
                        </span>
                    </div>
                </div>

                <div class="character-stats">
                    <div class="stat">
                        <span class="stat-label">Phone:</span>
                        <span class="stat-value">${char.identity.phone}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Job:</span>
                        <span class="stat-value">${char.identity.job} (Rank ${char.identity.jobrank})</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Nationality:</span>
                        <span class="stat-value">${char.identity.nationality}</span>
                    </div>
                    <div class="stat money-stat">
                        <span class="stat-label">Wallet:</span>
                        <span class="stat-value">$${char.money?.wallet?.toLocaleString() || 0}</span>
                    </div>
                    <div class="stat money-stat">
                        <span class="stat-label">Bank:</span>
                        <span class="stat-value">$${char.money?.bank?.toLocaleString() || 0}</span>
                    </div>
                </div>

                <div class="character-vehicles">
                    <h4>Vehicles</h4>
                    <div class="vehicles-grid">
                        ${char.vehicles?.map(vehicle => `
                            <div class="vehicle-card">
                                <img src="${vehicle.mdt_image || 'assets/images/placeholder.png'}"
                                     alt="Vehicle Image"
                                     class="vehicle-image">
                                <div class="vehicle-info">
                                    <span class="vehicle-name">${vehicle.vehicle.toUpperCase()}</span>
                                    <span class="vehicle-plate">${vehicle.vehicle_plate}</span>
                                    <span class="vehicle-vin">VIN: ${vehicle.vehicle_vin}</span>
                                    <div class="vehicle-stats">
                                        <span>Insurance: ${vehicle.insurance}%</span>
                                        <span>Lives: ${vehicle.lives}</span>
                                        <span>Odometer: ${vehicle.odometer.toLocaleString()} mi</span>
                                    </div>
                                </div>
                            </div>
                        `).join('') || 'No vehicles owned'}
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    // Show loading screen if we're on the callback page
    if (window.location.pathname.includes('/auth/discord/callback')) {
        showLoadingScreen();
        handleAuthCallback();
        return;
    }

    // Check for auth error
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('auth_error')) {
        alert('Authentication failed. Please try again.');
    }

    // Check authentication status
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
        try {
            currentUser = JSON.parse(userData);
            updateAuthUI();
        } catch (error) {
            console.error('Error parsing stored auth data:', error);
            handleLogout();
        }
    }

    // If user is logged in, refresh game data
    if (currentUser && currentUser.id) {
        await refreshGameData();
    }

    // Load initial content
    loadContent('FEATURES');
});

function getUserInfo() {
    if (currentUser) {
        return {
            discord: currentUser.user_metadata.full_name,
            ingame: localStorage.getItem('ingameName') || ''
        };
    }
    return null;
}

function submitUserInfo(event) {
    event.preventDefault();
    const ingameName = document.getElementById('ingameName').value;
    localStorage.setItem('ingameName', ingameName);

    closeUserInfoModal();
    if (pendingAction) {
        pendingAction();
        pendingAction = null;
    }
}

// Authentication handlers
function handleAuth() {
    try {
        if (!window.appConfig) {
            console.error('App configuration is not loaded');
            alert('Error: Unable to load configuration. Please try again later.');
            return;
        }

        if (!window.appConfig.DISCORD_CLIENT_ID) {
            console.error('Discord Client ID is not configured');
            alert('Error: Discord configuration is missing. Please try again later.');
            return;
        }

        const scope = window.appConfig.OAUTH_SCOPES || 'identify';

        const params = new URLSearchParams({
            client_id: window.appConfig.DISCORD_CLIENT_ID,
            redirect_uri: window.appConfig.DISCORD_REDIRECT_URI,
            response_type: 'code',
            scope: scope,
            prompt: 'consent'
        });

        const authUrl = `${window.appConfig.AUTH_ENDPOINT}?${params.toString()}`;
        console.log('Auth URL:', authUrl);

        // Show loading screen before redirect
        showLoadingScreen();
        window.location.href = authUrl;
    } catch (error) {
        console.error('Auth error:', error);
        hideLoadingScreen();
        alert('An error occurred during authentication. Please try again later.');
    }
}

function handleLogout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    currentUser = null;
    updateAuthUI();
}

function updateAuthUI() {
    const loginButton = document.querySelector('.login-button');
    const logoutButton = document.querySelector('.logout-button');

    if (currentUser) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        refreshGameData(); // Refresh game data when auth state changes
    } else {
        loginButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
        gameData = null;
    }
}

// Handle OAuth callback
async function handleAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        try {
            console.log('Processing auth callback with code:', code);

            const response = await fetch(window.appConfig.TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Token endpoint error:', errorText);
                throw new Error('Failed to authenticate with Discord');
            }

            const data = await response.json();

            if (data.token && data.user) {
                localStorage.setItem('auth_token', JSON.stringify(data.token));
                localStorage.setItem('user_data', JSON.stringify(data.user));
                currentUser = data.user;
                updateAuthUI();

                // Redirect to home with loading screen
                showLoadingScreen();
                window.location.replace('/');
            } else {
                throw new Error('Invalid authentication response');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            showLoadingScreen();
            window.location.replace('/?auth_error=1');
        }
    }
}

// Add this function to handle player profile display
async function loadPlayerProfile() {
    if (!currentUser) {
        document.getElementById('content').innerHTML = `
            <div class="profile-container">
                <h1>Player Profile</h1>
                <div class="login-prompt">
                    <p>Please login with Discord to view your profile.</p>
                    <button class="nav-button" onclick="handleAuth()">Login with Discord</button>
                </div>
            </div>
        `;
        return;
    }

    // Refresh game data before displaying
    await refreshGameData();

    document.getElementById('content').innerHTML = `
        <div class="profile-container">
            <h1>Player Profile</h1>
            <div class="profile-header">
                <div class="discord-info">
                    <img src="https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png"
                         alt="Discord Avatar"
                         class="discord-avatar"
                         onerror="this.src='assets/images/placeholder.png'">
                    <div class="discord-details">
                        <h2>${currentUser.username}</h2>
                        <span class="discord-tag">#${currentUser.discriminator}</span>
                    </div>
                </div>
                <button onclick="refreshGameData()" class="refresh-button">
                    Refresh Data
                </button>
            </div>
            ${displayCharacterInfo()}
        </div>
    `;
}