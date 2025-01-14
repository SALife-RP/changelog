// Main application logic
let currentView = "home";
let currentVehicle = null;
let userInfo = null;
let pendingAction = null;
let currentPage = 1;
const charactersPerPage = 14;
let sortedIdentities = null;
let sortedVehicles = null;
let currentUser = null;
let gameData = null;
let characterData = null;

// Add a refresh cooldown
let lastRefresh = 0;
const REFRESH_COOLDOWN = 5000; // 5 seconds cooldown

// Add these functions at the top level
function showLoadingScreen() {
    document.getElementById("loadingScreen").classList.add("active");
    document.body.style.overflow = "hidden";
}

function hideLoadingScreen() {
    document.getElementById("loadingScreen").classList.remove("active");
    document.body.style.overflow = "";
}

async function loadContent(filename) {
    try {
        if (filename === "server") {
            await loadServerInfo();
            return;
        }

        const response = await fetch(`./${filename}.md`);
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

        // Add container and styling for better content layout
        document.getElementById("content").innerHTML = `
            <div class="content-wrapper ${filename.toLowerCase()}-content">
                ${processedContent}
            </div>
        `;

        // Add lightbox functionality to images
        document.querySelectorAll(".feature-image").forEach((img) => {
            img.onclick = function() {
                if (this.src !== "assets/images/logo.png") {
                    this.requestFullscreen();
                }
            };
        });

        // Add styling to headings and lists
        if (filename === "FEATURES" || filename === "CHANGELOG") {
            enhanceContentStyling();
        }
    } catch (error) {
        console.error("Error loading content:", error);
        document.getElementById("content").innerHTML =
            '<div class="error-message">Failed to load content. Please try again later.</div>';
    }
}

function enhanceContentStyling() {
    // Center H1
    document.querySelector(".content-wrapper h1").style.textAlign = "center";

    // Center blockquotes
    document
        .querySelectorAll(".content-wrapper blockquote")
        .forEach((blockquote) => {
            blockquote.style.textAlign = "center";
        });

    // Add icons to headings
    document.querySelectorAll(".content-wrapper h2").forEach((heading) => {
        heading.classList.add("enhanced-heading");
        heading.innerHTML = `<span class="heading-icon">⚡</span>${heading.innerHTML}`;
    });

    // Style lists
    document.querySelectorAll(".content-wrapper ul").forEach((list) => {
        list.classList.add("enhanced-list");
    });

    document.querySelectorAll(".content-wrapper li").forEach((item) => {
        item.classList.add("enhanced-list-item");
        item.innerHTML = `<span class="list-icon">▹</span>${item.innerHTML}`;
    });

    // Add animation classes
    document
        .querySelectorAll(".content-wrapper > *")
        .forEach((element, index) => {
            element.classList.add("fade-in-element");
            element.style.animationDelay = `${index * 0.1}s`;
        });
}

function switchContent(view) {
    currentView = view;

    // Hide home sections first
    const homeElements = [
        ".hero-section",
        ".featured-content",
        ".features-highlight",
    ];

    homeElements.forEach((selector) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = "none";
        }
    });

    // Update active button state
    const buttons = document.querySelectorAll(".nav-button");
    buttons.forEach((button) => button.classList.remove("active"));

    // Find and activate the clicked button
  const activeButton = Array.from(buttons).find(
    (button) => button.getAttribute("onclick")?.includes(view) // Fixed optional chaining operator
  );
    if (activeButton) {
        activeButton.classList.add("active");
    }

    // Handle content switching
    switch (view) {
        case "features":
            loadContent("FEATURES");
            break;
        case "changelog":
            loadContent("CHANGELOG");
            break;
        case "server":
            loadContent("server");
            break;
        case "profile":
            loadPlayerProfile();
            break;
        case "home":
            loadHomeContent();
            break;
    }
}
async function loadServerInfo() {
    try {
        const response = await fetch(
            "https://servers-frontend.fivem.net/api/servers/single/zjepzy"
        );
        const data = await response.json();
        const serverData = data.Data;

        // Initialize managers with server data
        await window.vehicleManager.initialize(serverData);
        await window.inventoryManager.initialize(serverData);
        await window.characterManager.initialize(serverData);

        // Generate server info HTML
        const serverInfoHtml = generateServerInfoHtml(serverData);
        document.getElementById("content").innerHTML = serverInfoHtml;
    } catch (error) {
        console.error("Error loading server info:", error);
        document.getElementById("content").innerHTML = `
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
            ${window.inventoryManager.generateContainer()}
            ${window.vehicleManager.generateContainer()}
        </div>
    `;
}

function generateServerStats(serverData) {
    return `
        <div class="server-stats-grid">
            <div class="server-stat-card">
                <h3>Players</h3>
                <div class="stat-value">${serverData.players?.length || 0}/${
    serverData.svMaxclients || 32
  }</div>
                <div class="stat-label">Online Players</div>
            </div>
            <div class="server-stat-card">
                <h3>Server Name</h3>
                <div class="stat-value">${
                  serverData.hostname || "SA Life"
                }</div>
            </div>
            <div class="server-stat-card">
                <h3>Game Type</h3>
                <div class="stat-value">${
                  serverData.vars?.gametype || "Roleplay"
                }</div>
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

    // Check if enough time has passed since last refresh
    const now = Date.now();
    if (now - lastRefresh < REFRESH_COOLDOWN) {
        console.log("Refresh cooldown active, skipping refresh");
        return;
    }

    lastRefresh = now;

    try {
        const response = await fetch("/.netlify/functions/refresh-game-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                discord_id: currentUser.id,
            }),
        });

        if (!response.ok) throw new Error("Failed to refresh game data");

        const data = await response.json();
        console.log("Refreshed game data:", data);

        if (data) {
            gameData = data;
            // Update localStorage with new game data
            const userData = JSON.parse(localStorage.getItem("user_data"));
            userData.game_data = data;
            localStorage.setItem("user_data", JSON.stringify(userData));

            // Only update the display if we're on the profile page
            if (currentView === "profile") {
                updateProfileDisplay();
            }
        }
    } catch (error) {
        console.error("Error refreshing game data:", error);
    }
}

function updateProfileDisplay() {
    document.getElementById("content").innerHTML = `
        <div class="profile-container">
            <h1>Player Profile</h1>
            <div class="profile-header">
                <div class="discord-info">
                    <img src="https://cdn.discordapp.com/avatars/${
                      currentUser.id
                    }/${currentUser.avatar}.png"
                         alt="Discord Avatar"
                         class="discord-avatar"
                         onerror="this.src='assets/images/placeholder.png'"
                         loading="lazy">
                    <div class="discord-details">
                        <h2>${currentUser.username}</h2>
                        <span class="discord-tag">#${
                          currentUser.discriminator
                        }</span>
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

function displayCharacterInfo() {
    if (!gameData) {
        return '<div class="no-characters">Loading player data...</div>';
    }

    if (!gameData.characters || gameData.characters.length === 0) {
        return '<div class="no-characters">No characters found</div>';
    }

    let html = '<div class="characters-section">';
    html += "<h2>Your Characters</h2>";

    gameData.characters.forEach((char, index) => {
                console.log("Character data:", char);
                // {
                //     "identity": [
                //         {
                //             "user_id": 83,
                //             "registration": "007XON",
                //             "phone": "94112",
                //             "firstname": "Lamar",
                //             "name": "Davidson",
                //             "age": 35,
                //             "inventory": "[{\"slot\":1,\"count\":1,\"name\":\"phone\"}]",
                //             "inventory2": null,
                //             "health_state": null,
                //             "special": "Normal",
                //             "dob": "01/01/1989",
                //             "sex": "male",
                //             "mdt_image": "https://i.imgur.com/osAfgH2.png",
                //             "job": "unemployed",
                //             "jobrank": 1,
                //             "nationality": "American"
                //         }
                //     ],
                //         "money": [],
                //             "vehicles": []
                // }
                // Get the first identity object from the array
                const identity = char.identity[0] || {};
                const money = char.money[0] || { cash: 0, debt: 0 };

                const vehicles = char.vehicles || [];
                // Calculate total money
                const cash = money.cash || 0;
                const debt = money.debt || 0;

                console.log("Identity: ", identity);
                console.log("Money: ", money);
                console.log("Vehicles: ", vehicles);

                console.log("Identity MDT Image: ", identity.mdt_image);
                console.log("Identity name: ", identity.firstname);
                console.log("Identity name: ", identity.name);

                console.log("Identity sex: ", identity.sex);

                console.log("Money: ", money);

                html += `
            <div class="character-card">
                <div class="character-header">
                    <img src="${
                      identity.mdt_image || "assets/images/placeholder.png"
                    }"
                         alt="Character Image"
                         class="character-image"
                         onerror="this.src='assets/images/placeholder.png'"
                         loading="lazy">
                    <div class="character-title">
                        <h3>${identity.firstname || "Unknown"} ${
      identity.name || ""
    }</h3>
                        <span class="character-details">
                            ${identity.age ? `Age: ${identity.age}` : ""} ${
      identity.sex ? `| Sex: ${identity.sex}` : ""
    }
                        </span>
                    </div>
                </div>

                <div class="character-stats">
                    <div class="stat">
                        <span class="stat-label">Phone:</span>
                        <span class="stat-value">${
                          identity.phone || "N/A"
                        }</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Job:</span>
                        <span class="stat-value">${
                          identity.job || "Unemployed"
                        } ${
      identity.jobrank ? `(Rank ${identity.jobrank})` : ""
    }</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Nationality:</span>
                        <span class="stat-value">${
                          identity.nationality || "Unknown"
                        }</span>
                    </div>
                    <div class="stat money-stat">
                        <span class="stat-label">Cash:</span>
                        <span class="stat-value">$${cash.toLocaleString()}</span>
                    </div>
                    <div class="stat debt-stat">
                        <span class="stat-label">Debt:</span>
                        <span class="stat-value">$${debt.toLocaleString()}</span>
                    </div>
                </div>

                ${
                  vehicles.length > 0
                    ? `
                    <div class="character-vehicles">
                        <h4>Vehicles (${vehicles.length})</h4>
                        <div class="vehicles-grid">
                            ${vehicles
                              .map(
                                (vehicle) => `
                                <div class="vehicle-card">
                                    <img src="${
                                      vehicle.mdt_image ||
                                      "assets/images/placeholder.png"
                                    }"
                                         alt="Vehicle Image"
                                         class="vehicle-image"
                                         onerror="this.src='assets/images/placeholder.png'"
                                         loading="lazy">
                                    <div class="vehicle-info">
                                        <span class="vehicle-name">${
                                          vehicle.vehicle?.toUpperCase() ||
                                          "Unknown Vehicle"
                                        }</span>
                                        <span class="vehicle-plate">${
                                          vehicle.vehicle_plate || "No Plate"
                                        }</span>
                                        <span class="vehicle-vin">VIN: ${
                                          vehicle.vehicle_vin || "Unknown"
                                        }</span>
                                        <div class="vehicle-stats">
                                            <span>Insurance: ${
                                              vehicle.insurance || 0
                                            }%</span>
                                            <span>Lives: ${
                                              vehicle.lives || 0
                                            }</span>
                                            <span>Odometer: ${(
                                              vehicle.odometer || 0
                                            ).toLocaleString()} mi</span>
                                        </div>
                                    </div>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                `
                    : '<div class="no-vehicles">No vehicles owned</div>'
                }
                ${window.gamesManager.generateContainer(
                  identity.user_id,
                  money.cash || 0
                )}
            </div>
        `;
  });

  html += "</div>";
  return html;
}

// Initialize the application
document.addEventListener("DOMContentLoaded", async () => {
  // Show loading screen if we're on the callback page
  if (window.location.pathname.includes("/auth/discord/callback")) {
    showLoadingScreen();
    handleAuthCallback();
    return;
  }

  // Check for auth error
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("auth_error")) {
    alert("Authentication failed. Please try again.");
  }

  // Check authentication status
  const token = localStorage.getItem("auth_token");
  const userData = localStorage.getItem("user_data");

  if (token && userData) {
    try {
      currentUser = JSON.parse(userData);
      if (currentUser.game_data) {
        gameData = currentUser.game_data;
      }
      updateAuthUI();
    } catch (error) {
      console.error("Error parsing stored auth data:", error);
      handleLogout();
    }
  }

  // Load home content by default
  switchContent("home");
});

function getUserInfo() {
  if (currentUser) {
    return {
      discord: currentUser.username,
      ingame: currentUser.game_data?.characters?.[0]?.identity?.firstname || "",
    };
  }
  return null;
}

function submitUserInfo(event) {
  if (event) event.preventDefault();
  if (!currentUser) return;

  const ingameName = document.getElementById("ingameName")?.value;
  if (ingameName) {
    localStorage.setItem("ingameName", ingameName);
  }

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
      console.error("App configuration is not loaded");
      alert("Error: Unable to load configuration. Please try again later.");
      return;
    }

    if (!window.appConfig.DISCORD_CLIENT_ID) {
      console.error("Discord Client ID is not configured");
      alert("Error: Discord configuration is missing. Please try again later.");
      return;
    }

    const scope = window.appConfig.OAUTH_SCOPES || "identify";

    const params = new URLSearchParams({
      client_id: window.appConfig.DISCORD_CLIENT_ID,
      redirect_uri: window.appConfig.DISCORD_REDIRECT_URI,
      response_type: "code",
      scope: scope,
      prompt: "consent",
    });

    const authUrl = `${window.appConfig.AUTH_ENDPOINT}?${params.toString()}`;
    console.log("Auth URL:", authUrl);

    // Show loading screen before redirect
    showLoadingScreen();
    window.location.href = authUrl;
  } catch (error) {
    console.error("Auth error:", error);
    hideLoadingScreen();
    alert("An error occurred during authentication. Please try again later.");
  }
}
function handleLogout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
  currentUser = null;
  updateAuthUI();
}

function updateAuthUI() {
  const loginButton = document.querySelector(".login-button");
  const logoutButton = document.querySelector(".logout-button");

  if (currentUser) {
    loginButton.style.display = "none";
    logoutButton.style.display = "inline-block";

    // Only refresh game data if we don't have it yet
    if (!gameData && currentView === "profile") {
      refreshGameData();
    }
  } else {
    loginButton.style.display = "inline-block";
    logoutButton.style.display = "none";
    gameData = null;
  }
}

// Handle OAuth callback
async function handleAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    try {
      console.log("Processing auth callback with code:", code);

      const response = await fetch(window.appConfig.TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Token endpoint error:", errorText);
        throw new Error("Failed to authenticate with Discord");
      }

      const data = await response.json();

      if (data.token && data.user) {
        localStorage.setItem("auth_token", JSON.stringify(data.token));
        localStorage.setItem("user_data", JSON.stringify(data.user));
        currentUser = data.user;
        updateAuthUI();

        // Redirect to home with loading screen
        showLoadingScreen();
        window.location.replace("/");
      } else {
        throw new Error("Invalid authentication response");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      showLoadingScreen();
      window.location.replace("/?auth_error=1");
    }
  }
}

async function loadHomeContent() {
  // Hide the main content div
  document.getElementById("content").innerHTML = "";

  // Show home sections
  const homeElements = [
    ".hero-section",
    ".featured-content",
    ".features-highlight",
  ];

  homeElements.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.display = "block";
    }
  });
}

// Add this function to handle player profile display
async function loadPlayerProfile() {
  if (!currentUser) {
    document.getElementById("content").innerHTML = `
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

  // Show loading state
  document.getElementById("content").innerHTML = `
        <div class="profile-container">
            <h1>Player Profile</h1>
            <div class="loading-spinner"></div>
        </div>
    `;

  // Only refresh if we don't have data
  if (!gameData) {
    await refreshGameData();
  }

  // Get the game data from user data if available
  if (!gameData && currentUser.game_data) {
    gameData = currentUser.game_data;
  }

  document.getElementById("content").innerHTML = `
        <div class="profile-container">
            <h1>Player Profile</h1>
            <div class="profile-header">
                <div class="discord-info">
                    <img src="https://cdn.discordapp.com/avatars/${
                      currentUser.id
                    }/${currentUser.avatar}.png"
                         alt="Discord Avatar"
                         class="discord-avatar"
                         onerror="this.src='assets/images/placeholder.png'">
                    <div class="discord-details">
                        <h2>${currentUser.username}</h2>
                        <span class="discord-tag">#${
                          currentUser.discriminator
                        }</span>
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

// Update the character data loading function
async function loadCharacterData(userData) {
  try {
    if (!userData || !userData.game_data || !userData.game_data.characters) {
      console.warn("No character data available");
      return;
    }

    characterData = userData.game_data.characters;

    // Format the character data for display
    const formattedCharacters = characterData.map((character) => {
      const identity = character.identity[0] || {};
      return {
        name: `${identity.firstname} ${identity.name}`,
        job: identity.job || "Unemployed",
        jobRank: identity.jobrank || 1,
        phone: identity.phone || "No Phone",
        registration: identity.registration || "No Registration",
        image: identity.mdt_image || "default-avatar.png",
        inventory: JSON.parse(identity.inventory || "[]"),
        // Add other relevant character data here
      };
    });

    // Update the UI with character data
    const characterContainer = document.getElementById("character-container");
    if (characterContainer) {
      characterContainer.innerHTML = formattedCharacters
        .map(
          (char) => `
                <div class="character-card">
                    <img src="${char.image}" alt="${char.name}" class="character-avatar">
                    <div class="character-info">
                        <h3>${char.name}</h3>
                        <p>Job: ${char.job} (Rank ${char.jobRank})</p>
                        <p>Phone: ${char.phone}</p>
                        <p>Registration: ${char.registration}</p>
                    </div>
                </div>
            `
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading character data:", error);
    // Show user-friendly error message
    const characterContainer = document.getElementById("character-container");
    if (characterContainer) {
      characterContainer.innerHTML = `
                <div class="error-message">
                    Unable to load character data. Please try again later.
                </div>
            `;
    }
  }
}

// Update the profile section content
function updateProfileContent(userData) {
  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
        <div class="profile-section">
            <h2>My Profile</h2>
            <div class="user-info">
                <img src="https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png" alt="Discord Avatar" class="discord-avatar">
                <h3>${userData.username}</h3>
            </div>
            <div id="character-container" class="character-container">
                <div class="loading">Loading characters...</div>
            </div>
        </div>
    `;

  // Load character data after setting up the container
  loadCharacterData(userData);
}