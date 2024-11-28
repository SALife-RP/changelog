// Inventory Manager
class InventoryManager {
    constructor() {
        this.items = [];
        this.filteredItems = [];
    }

    async initialize(serverData) {
        try {
            console.log('Initializing inventory manager...');
            const response = await fetch('/.netlify/functions/get-items');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data received from server');
            }

            // Convert items to our expected format
            this.items = Object.entries(data).map(([name, item]) => ({
                ...item,
                name
            }));
            this.filteredItems = [...this.items];
            console.log('Inventory initialized:', this.items.length, 'items');
            
            // Render items after initialization
            this.renderItems();
        } catch (error) {
            console.error('Error initializing inventory manager:', error);
            this.items = [];
            this.filteredItems = [];
            // Update the grid to show error
            const container = document.getElementById('inventoryGrid');
            if (container) {
                container.innerHTML = `<p class="error-message">Failed to load inventory items: ${error.message}</p>`;
            }
        }
    }

    searchItems(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        this.filteredItems = this.items.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.label.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
        this.renderItems();
    }

    renderItems() {
        const container = document.getElementById('inventoryGrid');
        if (!container) return;

        if (this.filteredItems.length === 0) {
            container.innerHTML = '<p>No items found</p>';
            return;
        }

        container.innerHTML = this.filteredItems.map(item => `
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

    generateContainer() {
        return `
            <div class="inventory-section">
                <div class="inventory-header">
                    <h2>Inventory Items</h2>
                    <input type="text" 
                           class="inventory-search" 
                           placeholder="Search items..." 
                           onInput="window.inventoryManager.searchItems(this.value)">
                </div>
                <div id="inventoryGrid" class="inventory-grid">
                    <p>Loading items...</p>
                </div>
            </div>
        `;
    }
}

// Initialize the inventory manager globally
window.inventoryManager = new InventoryManager();
console.log('inventoryManager initialized');