// Vehicle Manager
class VehicleManager {
    constructor() {
        this.vehicles = [];
        this.sortedVehicles = null;
    }

    async initialize(serverData) {
        try {
            const vehiclesData = JSON.parse(serverData.vars.vehicles_data_table || '{}');
            // Convert object to array and add key as id, filter invalid entries first
            this.vehicles = Object.entries(vehiclesData)
                .filter(([_, vehicle]) => {
                    // Ensure vehicle has required properties
                    return vehicle &&
                        (vehicle["1"] || vehicle.name) &&
                        (vehicle["2"] || vehicle.price);
                })
                .map(([key, vehicle]) => ({
                    ...vehicle,
                    id: key
                }));

            // Initial sort by price
            this.sortedVehicles = [...this.vehicles];
            this.sortVehicles('price');
            console.log('Vehicles initialized:', this.vehicles.length);
        } catch (error) {
            console.error('Error initializing vehicle manager:', error);
            this.vehicles = [];
            this.sortedVehicles = [];
        }
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
                                <option value="price">Price (Low to High)</option>
                                <option value="price-desc">Price (High to Low)</option>
                                <option value="name">Name (A-Z)</option>
                                <option value="name-desc">Name (Z-A)</option>
                                <option value="manufacturer">Manufacturer (A-Z)</option>
                                <option value="type">Type</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>Type Filter:</label>
                            <select onchange="vehicleManager.filterByType(this.value)">
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
        const types = new Set(this.vehicles
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
                ${this.sortedVehicles.map(vehicle => this.generateVehicleCard(vehicle)).join('')}
            </div>
        `;
    }

    generateVehicleCard(vehicle) {
        const name = vehicle["1"] || vehicle.name || "Unknown Vehicle";
        const model = vehicle.vehicle || "Unknown Model";
        const price = vehicle["2"] || vehicle.price || 0;
        const manufacturer = vehicle.manufacturer || "Unknown";
        const vehicleClass = vehicle.class || "N/A";
        const type = vehicle.type || "N/A";
        const imageUrl = vehicle.image || 'assets/images/vehicle-placeholder.png';
        const ownedNumber = vehicle.ownedNumber || 0;
        let limitDisplay;
        let limitStatus;
        let limitDescription;

        const limit = vehicle.limit !== undefined ? vehicle.limit : 0;

        if (limit === 0) {
            limitDisplay = 'Not Available';
            limitStatus = 'not-ownable';
            limitDescription = 'This vehicle cannot be purchased';
        } else if (limit >= 20) {
            limitDisplay = '∞';
            limitStatus = 'safe';
            limitDescription = 'No limit on ownership';
        } else {
            limitDisplay = limit;
            const ratio = ownedNumber / limit;
            if (ratio >= 0.9) {
                limitStatus = 'critical';
                limitDescription = 'Almost at server limit';
            } else if (ratio >= 0.7) {
                limitStatus = 'warning';
                limitDescription = 'Approaching server limit';
            } else if (ratio >= 0.5) {
                limitStatus = 'moderate';
                limitDescription = 'Server limit moderate';
            } else {
                limitStatus = 'safe';
                limitDescription = 'Well below server limit';
            }
        }

        return `
            <div class="vehicle-card"
                data-manufacturer="${manufacturer}"
                data-class="${vehicleClass}"
                data-type="${type}"
                data-price="${price}">
                <div class="vehicle-image">
                    <img src="${imageUrl}"
                        alt="${name}"
                        loading="lazy"
                        onerror="this.onerror=null; this.src='assets/images/vehicle-placeholder.png'; this.classList.add('error');"
                        onload="this.classList.add('loaded')">
                </div>
                <h4>${name}</h4>
                <div class="vehicle-details">
                    <p><strong>Manufacturer:</strong> ${manufacturer}</p>
                    <p><strong>Model:</strong> ${model}</p>
                    <p><strong>Class:</strong> ${vehicleClass}</p>
                    <p><strong>Price:</strong> $${Number(price).toLocaleString()}</p>
                    <p><strong>Type:</strong> ${type}</p>
                    <div class="limit-display">
                        <div class="limit-header">
                            <strong>Server Limit:</strong>
                            <span class="limit-badge ${limitStatus}" title="${limitDescription}">
                                ${limitDisplay}
                                ${limit > 0 && limit < 20 ?
                `<small class="limit-stats">${ownedNumber} owned / ${limitDisplay} max</small>`
                : ''}
                            </span>
                        </div>
                        <small class="limit-description">${limitDescription}</small>
                    </div>
                    ${vehicle.emergency ? '<p class="emergency-badge">Emergency Vehicle</p>' : ''}
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
        this.sortedVehicles = this.vehicles.filter(vehicle => {
            if (!vehicle) return false;

            const searchableFields = [
                vehicle["1"] || vehicle.name || '',
                vehicle.vehicle || '',
                vehicle.manufacturer || '',
                vehicle.class || '',
                vehicle.type || ''
            ];

            return searchableFields.some(field =>
                field.toLowerCase().includes(searchTerm)
            );
        });

        this.updateDisplay();
    }

    sortVehicles(sortBy) {
        this.sortedVehicles.sort((a, b) => {
            switch (sortBy) {
                case 'price': {
                    const priceA = a["2"] || a.price || 0;
                    const priceB = b["2"] || b.price || 0;
                    return priceA - priceB;
                }
                case 'price-desc': {
                    const priceA = a["2"] || a.price || 0;
                    const priceB = b["2"] || b.price || 0;
                    return priceB - priceA;
                }
                case 'name': {
                    const nameA = (a["1"] || a.name || '').toLowerCase();
                    const nameB = (b["1"] || b.name || '').toLowerCase();
                    return nameA.localeCompare(nameB);
                }
                case 'name-desc': {
                    const nameA = (a["1"] || a.name || '').toLowerCase();
                    const nameB = (b["1"] || b.name || '').toLowerCase();
                    return nameB.localeCompare(nameA);
                }
                case 'manufacturer': {
                    const mfgA = (a.manufacturer || '').toLowerCase();
                    const mfgB = (b.manufacturer || '').toLowerCase();
                    return mfgA.localeCompare(mfgB);
                }
                case 'type': {
                    const typeA = (a.type || '').toLowerCase();
                    const typeB = (b.type || '').toLowerCase();
                    return typeA.localeCompare(typeB);
                }
                default:
                    return 0;
            }
        });

        this.updateDisplay();
    }

    filterByType(type) {
        if (type === 'all') {
            this.sortedVehicles = [...this.vehicles];
        } else {
            this.sortedVehicles = this.vehicles.filter(vehicle =>
                vehicle.type?.toLowerCase() === type.toLowerCase()
            );
        }

        // Maintain current sort
        const currentSort = document.getElementById('sortVehicles').value;
        this.sortVehicles(currentSort);
    }

    updateDisplay() {
        const container = document.querySelector('.vehicles-container');
        if (container) {
            const gridHtml = this.generateVehiclesGrid();
            const existingGrid = container.querySelector('.vehicles-grid');

            if (existingGrid) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = gridHtml;
                existingGrid.replaceWith(tempDiv.querySelector('.vehicles-grid'));
            }
        }
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