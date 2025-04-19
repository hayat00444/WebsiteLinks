// Optimize page navigation by preloading pages
document.addEventListener('DOMContentLoaded', function() {
    // Preload commonly accessed pages
    preloadPages(['index.html', 'wallet.html', 'activity.html', 'account.html', 'wingo.html']);
    
    // Set up navigation event listeners
    setupNavigationListeners();
});

// Preload pages to improve navigation speed
function preloadPages(pages) {
    pages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
    });
}

// Set up optimized navigation
function setupNavigationListeners() {
    // Get all navigation buttons
    const navButtons = document.querySelectorAll('.nav-button button');
    
    // Add click event listeners with performance optimization
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show loading indicator
            showLoadingIndicator();
            
            // Get the page to navigate to
            const pageId = this.id;
            let targetPage = '';
            
            switch(pageId) {
                case 'home':
                    targetPage = 'index.html';
                    break;
                case 'activity':
                    targetPage = 'activity.html';
                    break;
                case 'wallet':
                    targetPage = 'wallet.html';
                    break;
                case 'account':
                    targetPage = 'account.html';
                    break;
                default:
                    targetPage = 'index.html';
            }
            
            // Navigate to the target page with a small delay to allow loading indicator to show
            setTimeout(() => {
                window.location.href = targetPage;
            }, 50);
        });
    });
    
    // Additional navigation elements (game sections, etc.)
    const gameSection = document.getElementById('wingo-game');
    if (gameSection) {
        gameSection.addEventListener('click', function() {
            showLoadingIndicator();
            setTimeout(() => {
                window.location.href = 'wingo.html';
            }, 50);
        });
    }
    
    // Back buttons with loading indicator
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showLoadingIndicator();
            setTimeout(() => {
                if (this.getAttribute('data-target')) {
                    window.location.href = this.getAttribute('data-target');
                } else {
                    window.history.back();
                }
            }, 50);
        });
    });
}

// Show loading indicator
function showLoadingIndicator() {
    // Create loading indicator if it doesn't exist
    let loader = document.getElementById('page-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(loader);
        
        // Add CSS for loader
        const style = document.createElement('style');
        style.textContent = `
            #page-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            }
            .loader-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #1565c0;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Show the loader
    loader.style.display = 'flex';
}