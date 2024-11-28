let inventoryItems = [];
let filteredItems = [];

function initializeInventoryData(serverData) {
    if (!serverData?.vars?.inventory_items) {
        console.error('No inventory items found in server data');
        return;
    }

    inventoryItems = Object.entries(serverData.vars.inventory_items).map(([name, item]) => ({
        ...item,
        name
    }));
    filteredItems = [...inventoryItems];
    renderInventoryItems();
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

function initializeInventory(serverData) {
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
        initializeInventoryData(serverData);
    }
}

// Initialize when switching to server info
document.addEventListener('contentChanged', function(e) {
    if (e.detail === 'server' && window.serverData) {
        initializeInventory(window.serverData);
    }
}); 