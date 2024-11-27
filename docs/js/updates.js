class UpdatesManager {
    constructor() {
        this.updates = [
            {
                id: 1,
                title: "PlaySALife.com Created",
                date: "2024-11-27",
                description: "PlaySALife.com is now live, providing a dedicated hub for all things SALife with integration of in-game data and server statistics.",
                type: "feature",
                image: "assets/images/updates/playsalife.png"
            },
            // {
            //     id: 2,
            //     title: "Community Event: Spring Festival",
            //     date: "2024-03-15",
            //     description: "Join us this weekend for our Spring Festival featuring races, competitions, and exclusive rewards!",
            //     type: "event",
            //     image: "assets/images/updates/spring-festival.jpg"
            // },
            // {
            //     id: 3,
            //     title: "Server Performance Improvements",
            //     date: "2024-03-10",
            //     description: "Major backend optimizations resulting in improved server performance and stability.",
            //     type: "technical",
            //     image: "assets/images/updates/server-update.jpg"
            // }
        ];
    }

    getLatestUpdates(limit = 3) {
        return this.updates.slice(0, limit);
    }

    renderUpdateCard(update) {
        return `
            <div class="update-card ${update.type}" data-id="${update.id}">
                <div class="update-image">
                    <img src="${update.image}" alt="${update.title}" onerror="this.src='assets/images/updates/default.jpg'">
                </div>
                <div class="update-content">
                    <div class="update-meta">
                        <span class="update-type">${update.type}</span>
                        <span class="update-date">${new Date(update.date).toLocaleDateString()}</span>
                    </div>
                    <h3>${update.title}</h3>
                    <p>${update.description}</p>
                </div>
            </div>
        `;
    }

    initializeUpdates() {
        const newsGrid = document.getElementById('newsGrid');
        if (!newsGrid) return;

        const latestUpdates = this.getLatestUpdates();
        newsGrid.innerHTML = latestUpdates.map(update => this.renderUpdateCard(update)).join('');
    }
}

// Initialize updates when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const updatesManager = new UpdatesManager();
    updatesManager.initializeUpdates();
}); 