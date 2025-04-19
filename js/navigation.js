/**
 * Optimized navigation system for the Goa Games platform
 * Provides preloading, caching, and smooth transitions between pages
 */

// Cache for storing preloaded pages
const pageCache = {};
const PRELOAD_DELAY = 200; // Delay before preloading to prioritize current page load

/**
 * Preload multiple pages in the background
 * @param {Array} pages - Array of page paths to preload
 */
function preloadPages(pages) {
    // Use setTimeout to avoid blocking the main page load
    setTimeout(() => {
        pages.forEach(page => {
            // Don't reload pages we've already cached
            if (!pageCache[page]) {
                // Create a fetch request to preload the page
                fetch(page)
                    .then(response => response.text())
                    .then(html => {
                        // Store the preloaded content in the cache
                        pageCache[page] = html;
                        console.log(`Preloaded: ${page}`);
                    })
                    .catch(error => {
                        console.error(`Failed to preload ${page}:`, error);
                    });
            }
        });
    }, PRELOAD_DELAY);
}

/**
 * Show the loading indicator before page navigation
 */
function showLoadingIndicator() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.style.display = 'flex';
    }
}

/**
 * Hide the loading indicator
 */
function hideLoadingIndicator() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

/**
 * Set up navigation event listeners for all navigation buttons
 */
function setupNavigationListeners() {
    // Map navigation button IDs to their corresponding pages
    const navMap = {
        'home': 'index.html',
        'activity': 'activity.html',
        'wallet': 'wallet.html',
        'account': 'account.html',
        'wingo-game': 'wingo.html'
    };

    // Add optimized event listeners to all navigation buttons
    Object.keys(navMap).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const destination = navMap[buttonId];
                
                // Show loading indicator
                showLoadingIndicator();
                
                // Small delay to allow the loading indicator to appear
                setTimeout(() => {
                    window.location.href = destination;
                }, 50);
            });
        }
    });
}

// Initialize navigation system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // List of pages to preload from the homepage
    const pagesToPreload = [
        'index.html',
        'activity.html',
        'wallet.html',
        'account.html',
        'wingo.html'
    ];
    
    // Preload pages in the background
    preloadPages(pagesToPreload);
    
    // Set up the navigation event listeners
    setupNavigationListeners();
});