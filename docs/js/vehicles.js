// Vehicle Manager
class VehicleManager {
    constructor() {
        this.vehicles = {};
        this.categories = {};
        this.sortedVehicles = null;
    }

    async initialize(serverData) {
        try {
            const vehiclesData = JSON.parse(serverData.vars.vehicles_data_table || '{}');
            this.vehicles = vehiclesData;
            this.categorizeVehicles();
            console.log('Vehicles initialized:', this.categories);
        } catch (error) {
            console.error('Error initializing vehicle manager:', error);
            this.vehicles = {};
            this.categories = {};
        }
    }

    categorizeVehicles() {
        this.categories = {};
        Object.entries(this.vehicles).forEach(([key, vehicle]) => {
            if (vehicle && vehicle.type) {
                if (!this.categories[vehicle.type]) {
                    this.categories[vehicle.type] = [];
                }
                this.categories[vehicle.type].push({...vehicle, key});
            }
        });
    }

    generateContainer() {
        return `
            <div class="vehicles-container">
                <h2>Available Vehicles</h2>
                <div class="vehicles-controls">
                    <div class="vehicles-search">
                        <input type="text" id="vehicleSearch" 
                            placeholder="Search vehicles..." 
                            onkeyup="vehicleManager.filterVehicles()">
                    </div>
                    <div class="vehicles-filters">
                        <div class="filter-group">
                            <label>Sort by:</label>
                            <select id="sortVehicles" onchange="vehicleManager.sortVehicles(this.value)">
                                <option value="name">Name (A-Z)</option>
                                <option value="price">Price (Low to High)</option>
                                <option value="price-desc">Price (High to Low)</option>
                                <option value="manufacturer">Manufacturer (A-Z)</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>Filter by Type:</label>
                            <select onchange="vehicleManager.filterByCategory('type', this.value)">
                                <option value="all">All Types</option>
                                ${this.generateTypeOptions()}
                            </select>
                        </div>
                    </div>
                </div>
                ${this.generateVehiclesGrid()}
            </div>
        `;
    }

    generateTypeOptions() {
        const types = new Set(Object.values(this.vehicles)
            .filter(v => v && v.type)
            .map(v => v.type));
        return Array.from(types)
            .sort()
            .map(type => `<option value="${type}">${type}</option>`)
            .join('');
    }

    generateVehiclesGrid() {
        return `
            <div class="vehicles-grid">
                ${Object.entries(this.categories).map(([category, vehicles]) => `
                    <div class="vehicle-category" data-category="${category}">
                        <h3>${category}</h3>
                        <div class="vehicles-grid">
                            ${vehicles.map(vehicle => this.generateVehicleCard(vehicle)).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    generateVehicleCard(vehicle) {
        const name = vehicle["1"] || vehicle.name || "Unknown Vehicle";
        const model = vehicle.vehicle || "Unknown Model";
        const price = vehicle["2"] || vehicle.price || 0;
        const manufacturer = vehicle.manufacturer || "Unknown";
        const vehicleClass = vehicle.class || "N/A";
        const vtype = vehicle.vtype || "N/A";
        const imageUrl = vehicle.image || 'assets/images/vehicle-placeholder.png';

        return `
            <div class="vehicle-card"
                data-manufacturer="${manufacturer}"
                data-class="${vehicleClass}"
                data-vtype="${vtype}"
                data-price="${price}">
                <div class="vehicle-image">
                    <img src="${imageUrl}"
                        alt="${name}"
                        onerror="this.src='assets/images/vehicle-placeholder.png'"
                        loading="lazy">
                </div>
                <h4>${name}</h4>
                <div class="vehicle-details">
                    <p><strong>Manufacturer:</strong> ${manufacturer}</p>
                    <p><strong>Model:</strong> ${model}</p>
                    <p><strong>Class:</strong> ${vehicleClass}</p>
                    <p><strong>Price:</strong> $${price.toLocaleString()}</p>
                    <p><strong>Type:</strong> ${vtype}</p>
                    ${vehicle.limit ? `<p><strong>Limit:</strong> ${vehicle.limit}</p>` : ''}
                    ${vehicle.emergency ? '<p><strong>Emergency Vehicle</strong></p>' : ''}
                </div>
                <button class="change-request-btn" onclick='vehicleManager.openChangeRequest(${JSON.stringify({
                    name,
                    model,
                    manufacturer,
                    class: vehicleClass,
                    price
                })})'>Request Change</button>
            </div>
        `;
    }

    filterVehicles() {
        const searchTerm = document.getElementById('vehicleSearch').value.toLowerCase();
        const vehicleCards = document.querySelectorAll('.vehicle-card');
        const allCategories = document.querySelectorAll('.vehicle-category');

        vehicleCards.forEach(card => {
            const vehicleText = card.textContent.toLowerCase();
            card.style.display = vehicleText.includes(searchTerm) ? '' : 'none';
        });

        // Hide empty categories
        allCategories.forEach(category => {
            const visibleCards = Array.from(category.querySelectorAll('.vehicle-card'))
                .filter(card => card.style.display !== 'none');
            category.style.display = visibleCards.length === 0 ? 'none' : '';
        });

        // Maintain sort order
        const currentSort = document.getElementById('sortVehicles').value;
        if (currentSort !== 'name') {
            this.sortVehicles(currentSort);
        }
    }

    sortVehicles(sortBy) {
        const categories = document.querySelectorAll('.vehicle-category');

        categories.forEach(category => {
            const vehiclesGrid = category.querySelector('.vehicles-grid');
            const vehicles = Array.from(vehiclesGrid.querySelectorAll('.vehicle-card'));

            vehicles.sort((a, b) => {
                switch (sortBy) {
                    case 'price': {
                        const priceA = this.extractPrice(a);
                        const priceB = this.extractPrice(b);
                        return priceA - priceB;
                    }
                    case 'price-desc': {
                        const priceA = this.extractPrice(a);
                        const priceB = this.extractPrice(b);
                        return priceB - priceA;
                    }
                    case 'name': {
                        const nameA = a.querySelector('h4')?.textContent?.toLowerCase() || '';
                        const nameB = b.querySelector('h4')?.textContent?.toLowerCase() || '';
                        return nameA.localeCompare(nameB);
                    }
                    case 'manufacturer': {
                        const mfgA = a.dataset.manufacturer.toLowerCase();
                        const mfgB = b.dataset.manufacturer.toLowerCase();
                        return mfgA.localeCompare(mfgB);
                    }
                    default:
                        return 0;
                }
            });

            // Clear and repopulate the grid
            const fragment = document.createDocumentFragment();
            vehicles.forEach(vehicle => fragment.appendChild(vehicle.cloneNode(true)));
            vehiclesGrid.innerHTML = '';
            vehiclesGrid.appendChild(fragment);
        });
    }

    extractPrice(card) {
        const priceText = card.textContent.match(/Price:\s*\$?([\d,]+)/);
        return parseInt(priceText ? priceText[1].replace(/,/g, '') : '0');
    }

    filterByCategory(categoryType, value) {
        const vehicleCards = document.querySelectorAll('.vehicle-card');
        const allCategories = document.querySelectorAll('.vehicle-category');

        allCategories.forEach(cat => cat.style.display = '');

        if (value === 'all') {
            vehicleCards.forEach(card => card.style.display = '');
            return;
        }

        vehicleCards.forEach(card => {
            card.style.display = card.dataset[categoryType]?.toLowerCase() === value.toLowerCase() ? '' : 'none';
        });

        // Hide empty categories
        allCategories.forEach(category => {
            const visibleCards = Array.from(category.querySelectorAll('.vehicle-card'))
                .filter(card => card.style.display !== 'none');
            category.style.display = visibleCards.length === 0 ? 'none' : '';
        });
    }

    openChangeRequest(vehicleData) {
        const modal = document.getElementById('changeRequestModal');
        document.getElementById('vehicleNameInModal').textContent = vehicleData.name;
        currentVehicle = vehicleData;
        modal.style.display = 'block';
    }
}

// Create and export the vehicle manager instance
window.vehicleManager = new VehicleManager(); 