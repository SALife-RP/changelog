// Inventory Manager
class InventoryManager {
    constructor() {
        this.items = [];
        this.filteredItems = [];
        this.initialized = false;

        // Pagination state
        this.currentPage = 1;
        this.itemsPerPage = 12;

        // Sorting state
        this.sortField = 'name';
        this.sortDirection = 'asc';
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
            this.initialized = true;
            console.log('Inventory initialized with', this.items.length, 'items');
        } catch (error) {
            console.error('Error initializing inventory manager:', error);
            this.items = [];
            this.filteredItems = [];
            this.initialized = false;
        }
    }

    searchItems(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        this.filteredItems = this.items.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            (item.label || '').toLowerCase().includes(searchTerm) ||
            (item.description || '').toLowerCase().includes(searchTerm)
        );
        this.currentPage = 1; // Reset to first page on new search
        this.sortItems(); // Apply current sort
        this.renderItems();
    }

    sortItems() {
        this.filteredItems.sort((a, b) => {
            let aVal = a[this.sortField] || '';
            let bVal = b[this.sortField] || '';

            // Handle numeric values
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return this.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
            }

            // Handle string values
            aVal = aVal.toString().toLowerCase();
            bVal = bVal.toString().toLowerCase();

            if (this.sortDirection === 'asc') {
                return aVal.localeCompare(bVal);
            } else {
                return bVal.localeCompare(aVal);
            }
        });
    }

    handleSort(field) {
        if (this.sortField === field) {
            // Toggle direction if same field
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // New field, default to ascending
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        this.sortItems();
        this.renderItems();
    }

    changePage(page) {
        const maxPage = Math.ceil(this.filteredItems.length / this.itemsPerPage);
        if (page >= 1 && page <= maxPage) {
            this.currentPage = page;
            this.renderItems();
        }
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredItems.length / this.itemsPerPage);
        if (totalPages <= 1) return '';

        let pages = '';
        for (let i = 1; i <= totalPages; i++) {
            pages += `
                <button class="page-number ${i === this.currentPage ? 'active' : ''}"
                        onclick="window.inventoryManager.changePage(${i})">
                    ${i}
                </button>
            `;
        }

        return `
            <div class="pagination">
                <button class="pagination-btn"
                        onclick="window.inventoryManager.changePage(${this.currentPage - 1})"
                        ${this.currentPage === 1 ? 'disabled' : ''}>
                    Previous
                </button>
                <div class="page-numbers">
                    ${pages}
                </div>
                <button class="pagination-btn"
                        onclick="window.inventoryManager.changePage(${this.currentPage + 1})"
                        ${this.currentPage === totalPages ? 'disabled' : ''}>
                    Next
                </button>
                <span class="pagination-info">
                    Showing ${(this.currentPage - 1) * this.itemsPerPage + 1}-${Math.min(this.currentPage * this.itemsPerPage, this.filteredItems.length)}
                    of ${this.filteredItems.length} items
                </span>
            </div>
        `;
    }

    renderItems() {
        console.log('Rendering items:', this.filteredItems.length);
        const container = document.getElementById('inventoryGrid');
        if (!container) {
            console.error('Inventory grid container not found during render');
            return;
        }

        if (this.filteredItems.length === 0) {
            container.innerHTML = '<p>No items found</p>';
            return;
        }

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const paginatedItems = this.filteredItems.slice(startIndex, endIndex);

        container.innerHTML = paginatedItems.map(item => `
            <div class="inventory-item">
                <div class="item-header">
                    <img src="${item.image || ''}" alt="${item.label || item.name}" class="item-image"
                         onerror="this.src='assets/images/placeholder-item.png'">
                    <div class="item-info">
                        <h3 class="item-name">${item.label || item.name}</h3>
                        <p class="item-label">${item.name}</p>
                    </div>
                </div>
                ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
                <div class="item-details">
                    <span class="item-detail rarity-${item.rarity || 'common'}">
                        ${(item.rarity || 'common').charAt(0).toUpperCase() + (item.rarity || 'common').slice(1)}
                    </span>
                    ${item.stack ? '<span class="item-detail">Stackable</span>' : ''}
                </div>
            </div>
        `).join('');

        // Render pagination
        const paginationContainer = document.getElementById('inventoryPagination');
        if (paginationContainer) {
            paginationContainer.innerHTML = this.renderPagination();
        }
    }

    generateContainer() {
        console.log('Generating inventory container');
        const container = `
            <div class="inventory-section">
                <div class="inventory-header">
                    <h2>Inventory Items</h2>
                    <div class="inventory-controls">
                        <input type="text"
                               class="inventory-search"
                               placeholder="Search items..."
                               onInput="window.inventoryManager.searchItems(this.value)">
                        <div class="sort-controls">
                            <select onchange="window.inventoryManager.handleSort(this.value)">
                                <option value="name" ${this.sortField === 'name' ? 'selected' : ''}>Name</option>
                                <option value="rarity" ${this.sortField === 'rarity' ? 'selected' : ''}>Rarity</option>
                                <option value="label" ${this.sortField === 'label' ? 'selected' : ''}>Label</option>
                            </select>
                            <button onclick="window.inventoryManager.handleSort(window.inventoryManager.sortField)">
                                ${this.sortDirection === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>
                </div>
                <div id="inventoryGrid" class="inventory-grid">
                    ${this.initialized ? '' : '<p>Loading items...</p>'}
                </div>
                <div id="inventoryPagination"></div>
            </div>
        `;

        // If already initialized, render items after a short delay
        if (this.initialized) {
            setTimeout(() => this.renderItems(), 0);
        }

        return container;
    }
}

// Initialize the inventory manager globally
window.inventoryManager = new InventoryManager();
console.log('inventoryManager initialized');