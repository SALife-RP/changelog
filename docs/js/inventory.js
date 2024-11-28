let inventoryItems = [];
let filteredItems = [];

async function fetchInventoryItems() {
    try {
        const response = await fetch('/.netlify/functions/get-items');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const items = await response.json();
        
        // Convert items to our expected format
        inventoryItems = Object.entries(items).map(([name, item]) => ({
            ...item,
            name
        }));
        filteredItems = [...inventoryItems];
        renderInventoryItems();
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        const container = document.getElementById('inventoryGrid');
        if (container) {
            container.innerHTML = '<p class="error-message">Failed to load inventory items. Please try again later.</p>';
        }
    }
}

function searchItems(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    filteredItems = inventoryItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.label.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );
    renderInventoryItems();
}

function renderInventoryItems() {
    const container = document.getElementById('inventoryGrid');
    if (!container) return;

    if (filteredItems.length === 0) {
        container.innerHTML = '<p>No items found</p>';
        return;
    }

    container.innerHTML = filteredItems.map(item => `
        <div class="inventory-item">
            <div class="item-header">
                <img src="${item.image}" alt="${item.label}" class="item-image" 
                     onerror="this.src='assets/images/placeholder-item.png'">
                <div class="item-info">
                    <h3 class="item-name">${item.label}</h3>
                    <p class="item-label">${item.name}</p>
                </div>
            </div>
            ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
            <div class="item-details">
                <span class="item-detail rarity-${item.rarity}">
                    ${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
                </span>
                <span class="item-detail">Weight: ${item.weight}</span>
                ${item.stack ? '<span class="item-detail">Stackable</span>' : ''}
                ${item.close ? '<span class="item-detail">Closeable</span>' : ''}
            </div>
        </div>
    `).join('');
}

function initializeInventory() {
    const serverContent = document.querySelector('#content');
    if (!serverContent) return;

    const inventorySection = `
        <div class="inventory-section">
            <div class="inventory-header">
                <h2>Inventory Items</h2>
                <input type="text" 
                       class="inventory-search" 
                       placeholder="Search items..." 
                       onInput="searchItems(this.value)">
            </div>
            <div id="inventoryGrid" class="inventory-grid">
                <p>Loading items...</p>
            </div>
        </div>
    `;

    // Add the inventory section to the server info content
    const serverInfo = serverContent.querySelector('.server-info');
    if (serverInfo) {
        serverInfo.insertAdjacentHTML('beforeend', inventorySection);
        fetchInventoryItems();
    }
}

// Initialize when switching to server info
document.addEventListener('contentChanged', function(e) {
    if (e.detail === 'server') {
        initializeInventory();
    }
}); 