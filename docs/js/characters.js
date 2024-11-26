// Character Manager
class CharacterManager {
    constructor() {
        this.characters = [];
        this.currentPage = 1;
        this.charactersPerPage = 14;
        this.sortedCharacters = null;
    }

    async initialize(serverData) {
        try {
            const identitiesData = serverData.vars.identities_table;
            this.characters = this.parseIdentities(identitiesData);
            this.sortedCharacters = [...this.characters];
            this.sortCharacters('userId-desc');
        } catch (error) {
            console.error('Error initializing character manager:', error);
            this.characters = [];
            this.sortedCharacters = [];
        }
    }

    parseIdentities(identitiesData) {
        try {
            let parsed = JSON.parse(identitiesData || '{}');
            if (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
            }
            return Object.values(parsed).filter(char => char !== null);
        } catch (error) {
            console.error('Error parsing identities:', error);
            return [];
        }
    }

    generateContainer() {
        return `
            <div class="characters-container" data-identities='${JSON.stringify(this.characters)}'>
                <h2>Characters</h2>
                <div class="characters-controls">
                    <div class="characters-search">
                        <input type="text" id="characterSearch" placeholder="Search characters..." onkeyup="characterManager.filterCharacters()">
                    </div>
                    <div class="characters-filters">
                        <div class="filter-group">
                            <label>Sort by:</label>
                            <select id="sortCharacters" onchange="characterManager.sortCharacters(this.value)">
                                <option value="userId-desc">User ID (High to Low)</option>
                                <option value="userId-asc">User ID (Low to High)</option>
                                <option value="name-asc">Name (A-Z)</option>
                                <option value="name-desc">Name (Z-A)</option>
                                <option value="age-asc">Age (Young to Old)</option>
                                <option value="age-desc">Age (Old to Young)</option>
                                <option value="registration-asc">Registration (A-Z)</option>
                                <option value="registration-desc">Registration (Z-A)</option>
                            </select>
                        </div>
                    </div>
                </div>
                ${this.generateCharactersGrid()}
            </div>
        `;
    }

    generateCharactersGrid() {
        const startIndex = (this.currentPage - 1) * this.charactersPerPage;
        const pageCharacters = this.sortedCharacters.slice(startIndex, startIndex + this.charactersPerPage);
        const totalPages = Math.ceil(this.sortedCharacters.length / this.charactersPerPage);

        return `
            <div class="characters-grid">
                ${pageCharacters.map(character => this.generateCharacterCard(character)).join('')}
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn" onclick="characterManager.changePage(-1)" ${this.currentPage === 1 ? 'disabled' : ''}>
                    <span class="pagination-arrow">←</span> Previous
                </button>
                <span class="page-info">Page ${this.currentPage} of ${totalPages} (${this.sortedCharacters.length} total)</span>
                <button class="pagination-btn" onclick="characterManager.changePage(1)" ${this.currentPage === totalPages ? 'disabled' : ''}>
                    Next <span class="pagination-arrow">→</span>
                </button>
            </div>
        `;
    }

    generateCharacterCard(character) {
        const firstname = character?.firstname || 'Unknown';
        const lastname = character?.name || 'Unknown';
        const age = character?.age || 'Unknown';
        const registration = character?.registration || 'None';
        const phone = character?.phone || 'None';
        const job = character?.job || 'Unemployed';
        const jobrank = character?.jobrank || 0;
        const userId = character?.user_id || 'Unknown';
        const mdtImage = character?.mdt_image || null;

        return `
            <div class="character-card"
                data-name="${firstname} ${lastname}"
                data-age="${age}"
                data-registration="${registration}"
                data-userid="${userId}">
                ${mdtImage ? `
                    <div class="character-image">
                        <img src="${mdtImage}" alt="Character Photo"
                            onerror="this.style.display='none'"
                            loading="lazy">
                    </div>
                ` : ''}
                <h4>${firstname} ${lastname}</h4>
                <div class="character-details">
                    <p><strong>User ID:</strong> ${userId}</p>
                    <p><strong>Age:</strong> ${age}</p>
                    <p><strong>Registration:</strong> ${registration}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Job:</strong> ${job} (Rank ${jobrank})</p>
                    ${character?.special ? `<p><strong>Special:</strong> ${character.special}</p>` : ''}
                    ${character?.nationality ? `<p><strong>Nationality:</strong> ${character.nationality}</p>` : ''}
                </div>
            </div>
        `;
    }

    filterCharacters() {
        const searchTerm = document.getElementById('characterSearch').value.toLowerCase();
        this.sortedCharacters = this.characters.filter(character => {
            if (!character) return false;

            const searchableFields = [
                `${character.firstname || ''} ${character.name || ''}`,
                character.registration || '',
                character.phone || '',
                character.job || '',
                character.nationality || '',
                character.user_id?.toString() || ''
            ];

            return searchableFields.some(field =>
                field.toLowerCase().includes(searchTerm)
            );
        });

        this.currentPage = 1;
        this.updateDisplay();
    }

    sortCharacters(sortBy) {
        const [field, direction] = sortBy.split('-');
        const isDesc = direction === 'desc';

        this.sortedCharacters.sort((a, b) => {
            let comparison = 0;
            switch (field) {
                case 'userId':
                    comparison = (parseInt(a.user_id) || 0) - (parseInt(b.user_id) || 0);
                    break;
                case 'name':
                    const nameA = `${a.firstname || ''} ${a.name || ''}`.trim().toLowerCase();
                    const nameB = `${b.firstname || ''} ${b.name || ''}`.trim().toLowerCase();
                    comparison = nameA.localeCompare(nameB);
                    break;
                case 'age':
                    comparison = (parseInt(a.age) || 0) - (parseInt(b.age) || 0);
                    break;
                case 'registration':
                    const regA = (a.registration || '').toLowerCase();
                    const regB = (b.registration || '').toLowerCase();
                    comparison = regA.localeCompare(regB);
                    break;
            }
            return isDesc ? -comparison : comparison;
        });

        this.updateDisplay();
    }

    changePage(delta) {
        const totalPages = Math.ceil(this.sortedCharacters.length / this.charactersPerPage);
        const newPage = this.currentPage + delta;

        if (newPage >= 1 && newPage <= totalPages) {
            this.currentPage = newPage;
            this.updateDisplay();
        }
    }

    updateDisplay() {
        const container = document.querySelector('.characters-container');
        if (container) {
            const gridHtml = this.generateCharactersGrid();
            const existingGrid = container.querySelector('.characters-grid');
            const existingPagination = container.querySelector('.pagination-controls');

            if (existingGrid && existingPagination) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = gridHtml;
                existingGrid.replaceWith(tempDiv.querySelector('.characters-grid'));
                existingPagination.replaceWith(tempDiv.querySelector('.pagination-controls'));
            }
        }
    }
}

// Create and export the character manager instance
window.characterManager = new CharacterManager(); 