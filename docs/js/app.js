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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
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
    const params = new URLSearchParams({
        client_id: window.appConfig.DISCORD_CLIENT_ID,
        redirect_uri: window.appConfig.DISCORD_REDIRECT_URI,
        response_type: 'code',
        scope: 'identify',
    });

    window.location.href = `${window.appConfig.AUTH_ENDPOINT}?${params.toString()}`;
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
    } else {
        loginButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
    }
}

// Handle OAuth callback
async function handleAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        try {
            const response = await fetch(window.appConfig.TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (data.token && data.user) {
                localStorage.setItem('auth_token', JSON.stringify(data.token));
                localStorage.setItem('user_data', JSON.stringify(data.user));
                currentUser = data.user;
                updateAuthUI();

                // Redirect back to home page
                window.location.href = '/';
            } else {
                throw new Error('Invalid authentication response');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            window.location.href = '/';
        }
    }
}

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
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

    // Handle OAuth callback if on callback page
    if (window.location.pathname === '/auth/discord/callback') {
        handleAuthCallback();
    }

    // Load initial content
    loadContent('FEATURES');
});