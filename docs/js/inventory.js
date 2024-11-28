// Inventory Manager
window.inventoryManager = {
    items: [],
    currentPage: 1,
    itemsPerPage: 12,
    searchTerm: '',
    sortBy: 'name',
    sortOrder: 'asc',

    async initialize(serverData) {
        // Initialize inventory data
        this.items = this.parseInventoryData(serverData);
        return this;
    },

    parseInventoryData(character) {
        if (!character ? .identity ? .[0] ? .inventory) return [];
        try {
            return JSON.parse(character.identity[0].inventory);
        } catch (error) {
            console.error('Error parsing inventory:', error);
            return [];
        }
    },

    filterItems() {
        return this.items.filter(item =>
            item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    },

    sortItems(items) {
        return items.sort((a, b) => {
            const aValue = a[this.sortBy];
            const bValue = b[this.sortBy];
            const modifier = this.sortOrder === 'asc' ? 1 : -1;

            return aValue > bValue ? modifier : -modifier;
        });
    },

    getPaginatedItems() {
        const filtered = this.filterItems();
        const sorted = this.sortItems(filtered);

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        return {
            items: sorted.slice(startIndex, endIndex),
            totalPages: Math.ceil(sorted.length / this.itemsPerPage),
            totalItems: sorted.length
        };
    },

    generateContainer() {
        const { items, totalPages, totalItems } = this.getPaginatedItems();

        return `
            <div class="inventory-section">
                <h2>Inventory</h2>

                <div class="inventory-controls">
                    <div class="search-box">
                        <input type="text"
                               id="inventorySearch"
                               placeholder="Search items..."
                               value="${this.searchTerm}"
                               onkeyup="window.inventoryManager.handleSearch(event)">
                    </div>

                    <div class="sort-controls">
                        <select id="sortBy" onchange="window.inventoryManager.handleSort(event)">
                            <option value="name" ${this.sortBy === 'name' ? 'selected' : ''}>Name</option>
                            <option value="count" ${this.sortBy === 'count' ? 'selected' : ''}>Quantity</option>
                            <option value="slot" ${this.sortBy === 'slot' ? 'selected' : ''}>Slot</option>
                        </select>
                        <button onclick="window.inventoryManager.toggleSortOrder()">
                            ${this.sortOrder === 'asc' ? '↑' : '↓'}
                        </button>
                    </div>
                </div>

                <div class="inventory-grid">
                    ${items.map(item => this.generateItemCard(item)).join('')}
                </div>

                ${this.generatePagination(totalPages, totalItems)}
            </div>
        `;
    },

    generateItemCard(item) {
        return `
            <div class="inventory-item">
                <img src="assets/images/items/${item.name}.png"
                     alt="${item.name}"
                     onerror="this.src='assets/images/items/default.png'">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>Quantity: ${item.count}</p>
                    <p>Slot: ${item.slot}</p>
                </div>
            </div>
        `;
    },

    generatePagination(totalPages, totalItems) {
        if (totalPages <= 1) return '';

        let pages = '';
        for (let i = 1; i <= totalPages; i++) {
            pages += `
                <button class="page-number ${i === this.currentPage ? 'active' : ''}"
                        onclick="window.inventoryManager.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        return `
            <div class="pagination">
                <button class="pagination-btn"
                        onclick="window.inventoryManager.goToPage(${this.currentPage - 1})"
                        ${this.currentPage === 1 ? 'disabled' : ''}>
                    Previous
                </button>
                <div class="page-numbers">
                    ${pages}
                </div>
                <button class="pagination-btn"
                        onclick="window.inventoryManager.goToPage(${this.currentPage + 1})"
                        ${this.currentPage === totalPages ? 'disabled' : ''}>
                    Next
                </button>
                <span class="pagination-info">
                    Showing ${(this.currentPage - 1) * this.itemsPerPage + 1}-${Math.min(this.currentPage * this.itemsPerPage, totalItems)}
                    of ${totalItems} items
                </span>
            </div>
        `;
    },

    handleSearch(event) {
        this.searchTerm = event.target.value;
        this.currentPage = 1;
        this.updateDisplay();
    },

    handleSort(event) {
        this.sortBy = event.target.value;
        this.updateDisplay();
    },

    toggleSortOrder() {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        this.updateDisplay();
    },

    goToPage(page) {
        const { totalPages } = this.getPaginatedItems();
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateDisplay();
        }
    },

    updateDisplay() {
        const container = document.querySelector('.inventory-section');
        if (container) {
            container.outerHTML = this.generateContainer();
        }
    }
};