// Global utility functions and event handlers

// Handle navigation across all pages
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation buttons if they exist
    const homeBtn = document.getElementById('home');
    const activityBtn = document.getElementById('activity');
    const walletBtn = document.getElementById('wallet');
    const accountBtn = document.getElementById('account');

    // Add navigation event listeners if buttons exist
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    if (activityBtn) {
        activityBtn.addEventListener('click', function() {
            window.location.href = 'activity.html';
        });
    }

    if (walletBtn) {
        walletBtn.addEventListener('click', function() {
            window.location.href = 'wallet.html';
        });
    }

    if (accountBtn) {
        accountBtn.addEventListener('click', function() {
            window.location.href = 'account.html';
        });
    }

    // Initialize user data if not exists
    initializeUserData();
});

// Initialize user data in localStorage if it doesn't exist
function initializeUserData() {
    // Set initial balance if not exists
    if (!localStorage.getItem('userBalance')) {
        localStorage.setItem('userBalance', '1000');
    }

    // Set up empty deposit history if not exists
    if (!localStorage.getItem('depositHistory')) {
        localStorage.setItem('depositHistory', JSON.stringify([]));
    }

    // Set up empty withdrawal history if not exists
    if (!localStorage.getItem('withdrawalHistory')) {
        localStorage.setItem('withdrawalHistory', JSON.stringify([]));
    }

    // Set up empty bet history if not exists
    if (!localStorage.getItem('betHistory')) {
        localStorage.setItem('betHistory', JSON.stringify([]));
    }
}

// Format currency
function formatCurrency(amount) {
    return '₹' + parseFloat(amount).toFixed(2);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Add bet to history
function addBetToHistory(betDetails) {
    const betHistory = JSON.parse(localStorage.getItem('betHistory') || '[]');
    betHistory.push({
        ...betDetails,
        date: new Date().toISOString()
    });
    localStorage.setItem('betHistory', JSON.stringify(betHistory));
}

// Update user balance
function updateBalance(amount) {
    const currentBalance = parseFloat(localStorage.getItem('userBalance') || '0');
    const newBalance = currentBalance + amount;
    localStorage.setItem('userBalance', newBalance.toString());
    
    // Update balance display if element exists on page
    const balanceElement = document.getElementById('balanceAmount') || document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = newBalance.toFixed(2);
    }
    
    return newBalance;
}

// Show a toast notification
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.position = 'fixed';
        toastContainer.style.top = '20px';
        toastContainer.style.right = '20px';
        toastContainer.style.zIndex = '1000';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.style.minWidth = '250px';
    toast.style.margin = '10px';
    toast.style.padding = '15px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    toast.style.backgroundColor = type === 'success' ? '#4caf50' : 
                                 type === 'error' ? '#f44336' : 
                                 type === 'warning' ? '#ff9800' : '#2196f3';
    toast.style.color = 'white';
    toast.textContent = message;
    toast.style.transition = 'opacity 0.5s ease';
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 500);
    }, 3000);
}
