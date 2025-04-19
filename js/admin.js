// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Admin login credentials (in a real app, this would be server-side)
    const adminCredentials = {
        username: 'admin',
        password: 'admin123'
    };

    // DOM Elements
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const adminLogin = document.getElementById('admin-login');
    const adminDashboard = document.getElementById('admin-dashboard');
    const adminUsername = document.getElementById('admin-username');
    const sidebarItems = document.querySelectorAll('.sidebar-menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    const logoutBtn = document.getElementById('logout-btn');

    // Modal elements
    const userEditModal = document.getElementById('user-edit-modal');
    const payoutModal = document.getElementById('payout-modal');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const cancelUserEdit = document.getElementById('cancel-user-edit');

    // Check if already logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        adminLogin.style.display = 'none';
        adminDashboard.style.display = 'block';
        const storedUsername = sessionStorage.getItem('adminUsername') || 'Admin';
        adminUsername.textContent = storedUsername;

        // Load admin data once logged in
        loadAdminData();
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Validate credentials (insecure for demo purposes only)
            if (username === adminCredentials.username && password === adminCredentials.password) {
                // Store login state
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('adminUsername', username);

                // Show dashboard
                adminLogin.style.display = 'none';
                adminDashboard.style.display = 'block';
                adminUsername.textContent = username;

                // Load admin data
                loadAdminData();
            } else {
                loginError.style.display = 'block';
                setTimeout(() => {
                    loginError.style.display = 'none';
                }, 3000);
            }
        });
    }

    // Sidebar navigation
    sidebarItems.forEach(item => {
        if (item.id !== 'logout-btn') {
            item.addEventListener('click', function() {
                // Update active sidebar item
                sidebarItems.forEach(si => si.classList.remove('active'));
                this.classList.add('active');

                // Show corresponding content section
                const sectionId = this.getAttribute('data-section');
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(`${sectionId}-section`).classList.add('active');
            });
        }
    });

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear session storage
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminUsername');

            // Show login form
            adminDashboard.style.display = 'none';
            adminLogin.style.display = 'block';
        });
    }

    // Close modal buttons
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            userEditModal.style.display = 'none';
            payoutModal.style.display = 'none';
        });
    });

    // Cancel user edit
    if (cancelUserEdit) {
        cancelUserEdit.addEventListener('click', function() {
            userEditModal.style.display = 'none';
        });
    }

    // Save game settings
    const saveGameSettings = document.getElementById('save-game-settings');
    if (saveGameSettings) {
        saveGameSettings.addEventListener('click', function() {
            const wingoMultiplier = document.getElementById('wingo-multiplier').value;
            const wingoTimer = document.getElementById('wingo-timer').value;

            // Save to localStorage (in a real app, this would go to a server)
            localStorage.setItem('wingoMultiplier', wingoMultiplier);
            localStorage.setItem('wingoTimer', wingoTimer);

            // Show success message
            showToast('Game settings saved successfully', 'success');
        });
    }

    // Save admin settings
    const saveSettings = document.getElementById('save-settings');
    if (saveSettings) {
        saveSettings.addEventListener('click', function() {
            const siteTitle = document.getElementById('site-title').value;
            const minDeposit = document.getElementById('min-deposit').value;
            const minWithdrawal = document.getElementById('min-withdrawal').value;
            const maintenanceMode = document.getElementById('maintenance-mode').value;

            // Save settings to localStorage
            const settings = {
                siteTitle,
                minDeposit,
                minWithdrawal,
                maintenanceMode: maintenanceMode === '1'
            };

            localStorage.setItem('adminSettings', JSON.stringify(settings));

            // Show success message
            showToast('Settings saved successfully', 'success');
        });
    }

    // Edit user button click (for dynamic items)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn') || e.target.parentElement.classList.contains('edit-btn')) {
            const userId = e.target.closest('tr').dataset.userId;
            openUserEditModal(userId);
        }

        if (e.target.classList.contains('approve-btn') || e.target.parentElement.classList.contains('approve-btn')) {
            const orderId = e.target.closest('tr').dataset.orderId; // Corrected to orderId
            approveDeposit(orderId); // Call approveDeposit function
        }
        if (e.target.classList.contains('reject-btn') || e.target.parentElement.classList.contains('reject-btn')) {
            const orderId = e.target.closest('tr').dataset.orderId; // Corrected to orderId
            rejectDeposit(orderId); // Call rejectDeposit function
        }
    });

    // User edit form submission
    const userEditForm = document.getElementById('user-edit-form');
    if (userEditForm) {
        userEditForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const userId = document.getElementById('edit-user-id').value;
            const userName = document.getElementById('edit-user-name').value;
            const userBalance = document.getElementById('edit-user-balance').value;
            const userStatus = document.getElementById('edit-user-status').value;

            // Update user data in localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userIndex = users.findIndex(user => user.id === userId);

            if (userIndex !== -1) {
                users[userIndex].name = userName;
                users[userIndex].balance = parseFloat(userBalance);
                users[userIndex].status = userStatus;

                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('userBalance', userBalance); // Update user balance

                // Close modal and refresh user table
                userEditModal.style.display = 'none';
                populateUserTable();

                // Show success message
                showToast('User updated successfully', 'success');
            }
        });
    }

    // Payout approval and rejection
    const approvePayoutBtn = document.getElementById('approve-payout');
    const rejectPayoutBtn = document.getElementById('reject-payout');

    if (approvePayoutBtn) {
        approvePayoutBtn.addEventListener('click', function() {
            const payoutId = document.getElementById('payout-id').textContent;
            processPayoutAction(payoutId, 'approved');
        });
    }

    if (rejectPayoutBtn) {
        rejectPayoutBtn.addEventListener('click', function() {
            const payoutId = document.getElementById('payout-id').textContent;
            processPayoutAction(payoutId, 'rejected');
        });
    }
});

// Load all admin data
function loadAdminData() {
    // Load dashboard stats
    loadDashboardStats();

    // Populate tables
    populateActivityTable();
    populateUserTable();
    populateTransactionTable();
    populatePayoutTable();

    // Load settings
    loadSettings();
}

// Load dashboard statistics
function loadDashboardStats() {
    // Get statistics from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const betHistory = JSON.parse(localStorage.getItem('betHistory') || '[]');
    const depositHistory = JSON.parse(localStorage.getItem('depositHistory') || '[]');
    const withdrawalHistory = JSON.parse(localStorage.getItem('withdrawalHistory') || '[]');

    // Calculate totals
    const totalUsers = users.length || 10; // Default for demo
    const totalBets = betHistory.length || 25; // Default for demo

    let totalDeposits = 0;
    depositHistory.forEach(deposit => {
        totalDeposits += parseFloat(deposit.amount || 0);
    });

    let totalWithdrawals = 0;
    withdrawalHistory.forEach(withdrawal => {
        totalWithdrawals += parseFloat(withdrawal.amount || 0);
    });

    // Set values in dashboard
    document.getElementById('total-users').textContent = totalUsers;
    document.getElementById('total-bets').textContent = totalBets;
    document.getElementById('total-deposits').textContent = '₹' + (totalDeposits || 10000).toFixed(2);
    document.getElementById('total-withdrawals').textContent = '₹' + (totalWithdrawals || 5000).toFixed(2);
}

// Populate activity table
function populateActivityTable() {
    const activityTableBody = document.getElementById('activity-table-body');

    if (!activityTableBody) {
        return;
    }

    // Get recent activities from localStorage
    const betHistory = JSON.parse(localStorage.getItem('betHistory') || '[]');
    const depositHistory = JSON.parse(localStorage.getItem('depositHistory') || '[]');
    const withdrawalHistory = JSON.parse(localStorage.getItem('withdrawalHistory') || '[]');

    // Combine all activities
    const allActivities = [
        ...depositHistory.map(item => ({...item, type: 'deposit'})),
        ...withdrawalHistory.map(item => ({...item, type: 'withdrawal'})),
        ...betHistory.map(item => ({...item, type: 'bet'}))
    ];

    // Sort by date (newest first)
    allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Take only the 10 most recent activities
    const recentActivities = allActivities.slice(0, 10);

    // Clear table
    activityTableBody.innerHTML = '';

    // Sample data for demonstration if no real data exists
    if (recentActivities.length === 0) {
        const sampleActivities = [
            { user: 'GOA1234', type: 'deposit', amount: 1000, date: '2023-07-20T10:30:00', status: 'completed' },
            { user: 'GOA5678', type: 'bet', amount: 500, date: '2023-07-20T11:15:00', status: 'won' },
            { user: 'GOA9012', type: 'withdrawal', amount: 2000, date: '2023-07-20T12:00:00', status: 'pending' },
            { user: 'GOA3456', type: 'bet', amount: 200, date: '2023-07-20T13:30:00', status: 'lost' },
            { user: 'GOA7890', type: 'deposit', amount: 5000, date: '2023-07-20T14:45:00', status: 'completed' }
        ];

        populateActivityRows(sampleActivities);
    } else {
        populateActivityRows(recentActivities);
    }

    function populateActivityRows(activities) {
        activities.forEach(activity => {
            const row = document.createElement('tr');

            // Format the status class
            let statusClass = '';
            if (activity.status === 'completed' || activity.status === 'won' || activity.status === 'approved') {
                statusClass = 'status-active';
            } else if (activity.status === 'pending') {
                statusClass = 'status-pending';
            } else {
                statusClass = 'status-inactive';
            }

            // Format the activity type
            let activityName = '';
            if (activity.type === 'deposit') {
                activityName = 'Deposit';
            } else if (activity.type === 'withdrawal') {
                activityName = 'Withdrawal';
            } else if (activity.type === 'bet') {
                activityName = 'Wingo Bet';
            }

            // Format the date
            const date = new Date(activity.date);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            row.innerHTML = `
                <td>${activity.user || 'GOA' + Math.floor(Math.random() * 10000)}</td>
                <td>${activityName}</td>
                <td>₹${parseFloat(activity.amount).toFixed(2)}</td>
                <td>${formattedDate}</td>
                <td><span class="status ${statusClass}">${activity.status}</span></td>
            `;

            activityTableBody.appendChild(row);
        });
    }
}

// Populate user table
function populateUserTable() {
    const usersTableBody = document.getElementById('users-table-body');

    if (!usersTableBody) {
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Clear table
    usersTableBody.innerHTML = '';

    // Sample data for demonstration if no real data exists
    if (users.length === 0) {
        const sampleUsers = [
            { id: 'GOA1234', name: 'User 1', balance: 1500, status: 'active' },
            { id: 'GOA5678', name: 'User 2', balance: 2500, status: 'active' },
            { id: 'GOA9012', name: 'User 3', balance: 500, status: 'inactive' },
            { id: 'GOA3456', name: 'User 4', balance: 3000, status: 'active' },
            { id: 'GOA7890', name: 'User 5', balance: 1000, status: 'suspended' }
        ];

        populateUserRows(sampleUsers);
    } else {
        populateUserRows(users);
    }

    function populateUserRows(userList) {
        userList.forEach(user => {
            const row = document.createElement('tr');
            row.dataset.userId = user.id;

            // Format the status class
            let statusClass = '';
            if (user.status === 'active') {
                statusClass = 'status-active';
            } else if (user.status === 'inactive') {
                statusClass = 'status-inactive';
            } else {
                statusClass = 'status-pending';
            }

            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>₹${parseFloat(user.balance).toFixed(2)}</td>
                <td><span class="status ${statusClass}">${user.status}</span></td>
                <td class="action-buttons">
                    <button class="action-btn edit-btn">Edit</button>
                    <button class="action-btn delete-btn">Block</button>
                </td>
            `;

            usersTableBody.appendChild(row);
        });
    }
}

// Populate transaction table
function populateTransactionTable() {
    const transactionsTableBody = document.getElementById('transactions-table-body');

    if (!transactionsTableBody) {
        return;
    }

    // Get transactions from localStorage
    const depositHistory = JSON.parse(localStorage.getItem('depositHistory') || '[]');
    const withdrawalHistory = JSON.parse(localStorage.getItem('withdrawalHistory') || '[]');

    // Combine all transactions
    const allTransactions = [
        ...depositHistory.map(item => ({...item, type: 'deposit'})),
        ...withdrawalHistory.map(item => ({...item, type: 'withdrawal'}))
    ];

    // Sort by date (newest first)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Clear table
    transactionsTableBody.innerHTML = '';

    // Sample data for demonstration if no real data exists
    if (allTransactions.length === 0) {
        const sampleTransactions = [
            { id: 'TXN1234', user: 'GOA1234', type: 'deposit', amount: 1000, date: '2023-07-20T10:30:00', status: 'completed' },
            { id: 'TXN5678', user: 'GOA5678', type: 'deposit', amount: 2500, date: '2023-07-19T15:45:00', status: 'completed' },
            { id: 'TXN9012', user: 'GOA9012', type: 'withdrawal', amount: 1500, date: '2023-07-18T12:30:00', status: 'pending' },
            { id: 'TXN3456', user: 'GOA3456', type: 'deposit', amount: 5000, date: '2023-07-17T09:15:00', status: 'completed' },
            { id: 'TXN7890', user: 'GOA7890', type: 'withdrawal', amount: 3000, date: '2023-07-16T14:00:00', status: 'completed' }
        ];

        populateTransactionRows(sampleTransactions);
    } else {
        populateTransactionRows(allTransactions);
    }

    function populateTransactionRows(transactions) {
        transactions.forEach(transaction => {
            const row = document.createElement('tr');

            // Format the status class
            let statusClass = '';
            if (transaction.status === 'completed' || transaction.status === 'approved') {
                statusClass = 'status-active';
            } else if (transaction.status === 'pending') {
                statusClass = 'status-pending';
            } else {
                statusClass = 'status-inactive';
            }

            // Generate transaction ID if not present
            const txnId = transaction.id || 'TXN' + Math.floor(Math.random() * 10000000);

            // Format the date
            const date = new Date(transaction.date);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            row.innerHTML = `
                <td>${txnId}</td>
                <td>${transaction.user || 'GOA' + Math.floor(Math.random() * 10000)}</td>
                <td>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
                <td>₹${parseFloat(transaction.amount).toFixed(2)}</td>
                <td>${formattedDate}</td>
                <td><span class="status ${statusClass}">${transaction.status}</span></td>
            `;

            transactionsTableBody.appendChild(row);
        });
    }
}

// Populate payout table
function populatePayoutTable() {
    const payoutsTableBody = document.getElementById('payouts-table-body');

    if (!payoutsTableBody) {
        return;
    }

    // Get pending withdrawals from localStorage
    const withdrawalHistory = JSON.parse(localStorage.getItem('withdrawalHistory') || '[]');
    const pendingWithdrawals = withdrawalHistory.filter(withdrawal => withdrawal.status === 'Pending');

    // Clear table
    payoutsTableBody.innerHTML = '';

    // Sample data for demonstration if no real data exists
    if (pendingWithdrawals.length === 0) {
        const samplePayouts = [
            { id: 'PAY1234', user: 'GOA1234', amount: 2000, bank: 'HDFC Bank - XXXX5678', date: '2023-07-20T10:30:00' },
            { id: 'PAY5678', user: 'GOA5678', amount: 5000, bank: 'SBI Bank - XXXX9012', date: '2023-07-19T15:45:00' },
            { id: 'PAY9012', user: 'GOA9012', amount: 1500, bank: 'ICICI Bank - XXXX3456', date: '2023-07-18T12:30:00' }
        ];

        populatePayoutRows(samplePayouts);
    } else {
        const formattedPayouts = pendingWithdrawals.map(payout => {
            // Get bank details from localStorage
            const bankDetails = JSON.parse(localStorage.getItem('bankDetails') || '{}');
            let bankInfo = 'Not provided';

            if (bankDetails && bankDetails.bankName) {
                bankInfo = `${bankDetails.bankName} - XXXX${bankDetails.accountNumber.slice(-4)}`;
            }

            return {
                id: 'PAY' + Math.floor(Math.random() * 10000000),
                user: localStorage.getItem('userId') || 'GOA' + Math.floor(Math.random() * 10000),
                amount: payout.amount,
                bank: bankInfo,
                date: payout.date
            };
        });

        populatePayoutRows(formattedPayouts);
    }

    function populatePayoutRows(payouts) {
        payouts.forEach(payout => {
            const row = document.createElement('tr');
            row.dataset.payoutId = payout.id;

            // Format the date
            const date = new Date(payout.date);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            row.innerHTML = `
                <td>${payout.id}</td>
                <td>${payout.user}</td>
                <td>₹${parseFloat(payout.amount).toFixed(2)}</td>
                <td>${payout.bank}</td>
                <td>${formattedDate}</td>
                <td class="action-buttons">
                    <button class="action-btn approve-btn">Process</button>
                </td>
            `;

            payoutsTableBody.appendChild(row);
        });
    }
}

// Load settings
function loadSettings() {
    // Load settings from localStorage
    const settings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
    const wingoMultiplier = localStorage.getItem('wingoMultiplier');
    const wingoTimer = localStorage.getItem('wingoTimer');

    // Set values in form fields if they exist
    if (document.getElementById('site-title')) {
        document.getElementById('site-title').value = settings.siteTitle || 'Goa Games';
    }

    if (document.getElementById('min-deposit')) {
        document.getElementById('min-deposit').value = settings.minDeposit || 500;
    }

    if (document.getElementById('min-withdrawal')) {
        document.getElementById('min-withdrawal').value = settings.minWithdrawal || 1000;
    }

    if (document.getElementById('maintenance-mode')) {
        document.getElementById('maintenance-mode').value = settings.maintenanceMode ? '1' : '0';
    }

    if (document.getElementById('wingo-multiplier')) {
        document.getElementById('wingo-multiplier').value = wingoMultiplier || 2;
    }

    if (document.getElementById('wingo-timer')) {
        document.getElementById('wingo-timer').value = wingoTimer || 30;
    }
}

// Open user edit modal
function openUserEditModal(userId) {
    const modal = document.getElementById('user-edit-modal');

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);

    // If no user found, use sample data
    const userData = user || {
        id: userId || 'GOA1234',
        name: 'User 1',
        balance: 1500,
        status: 'active'
    };

    // Set values in form fields
    document.getElementById('edit-user-id').value = userData.id;
    document.getElementById('edit-user-name').value = userData.name;
    document.getElementById('edit-user-balance').value = userData.balance;
    document.getElementById('edit-user-status').value = userData.status;

    // Show modal
    modal.style.display = 'flex';
}

// Open payout modal
function openPayoutModal(payoutId) {
    const modal = document.getElementById('payout-modal');

    // Get withdrawal history from localStorage
    const withdrawalHistory = JSON.parse(localStorage.getItem('withdrawalHistory') || '[]');
    const withdrawal = withdrawalHistory.find(w => w.id === payoutId);

    // If no withdrawal found, use sample data
    const payoutData = withdrawal || {
        id: payoutId || 'PAY1234',
        user: 'GOA1234',
        amount: 2000,
        bank: 'HDFC Bank - XXXX5678'
    };

    // Get bank details
    const bankDetails = JSON.parse(localStorage.getItem('bankDetails') || '{}');
    let bankInfo = 'Not provided';

    if (bankDetails && bankDetails.bankName) {
        bankInfo = `${bankDetails.bankName} (${bankDetails.holderName})<br>
                   Account: XXXX${bankDetails.accountNumber.slice(-4)}<br>
                   IFSC: ${bankDetails.ifscCode}`;
    }

    // Set values in modal
    document.getElementById('payout-id').textContent = payoutData.id;
    document.getElementById('payout-user').textContent = payoutData.user || 'GOA' + Math.floor(Math.random() * 10000);
    document.getElementById('payout-amount').textContent = '₹' + parseFloat(payoutData.amount).toFixed(2);
    document.getElementById('payout-bank').innerHTML = bankInfo;

    // Show modal
    modal.style.display = 'flex';
}

// Process payout action (approve/reject)
function processPayoutAction(payoutId, action) {
    // Get withdrawal history from localStorage
    const withdrawalHistory = JSON.parse(localStorage.getItem('withdrawalHistory') || '[]');
    const withdrawalIndex = withdrawalHistory.findIndex(w => w.id === payoutId);

    if (withdrawalIndex !== -1) {
        const withdrawal = withdrawalHistory[withdrawalIndex];
        const currentBalance = parseFloat(localStorage.getItem('userBalance') || '0');

        if (action === 'approved') {
            withdrawal.status = 'Completed';
            // Only deduct if not already deducted
            if (withdrawal.balanceUpdated !== true) {
                localStorage.setItem('userBalance', (currentBalance - withdrawal.amount).toString());
                withdrawal.balanceUpdated = true;
            }
        } else {
            withdrawal.status = 'Rejected';
            // Return the funds to user balance
            localStorage.setItem('userBalance', (currentBalance + withdrawal.amount).toString());
            withdrawal.balanceUpdated = false;
        }

        // Update withdrawal history
        withdrawalHistory[withdrawalIndex] = withdrawal;
        localStorage.setItem('withdrawalHistory', JSON.stringify(withdrawalHistory));
    }

    // Close modal
    document.getElementById('payout-modal').style.display = 'none';

    // Refresh payout table
    populatePayoutTable();

    // Show success message
    showToast(`Payout ${action} successfully`, 'success');
}

// Process deposit approval
function approveDeposit(orderId) {
    const depositHistory = JSON.parse(localStorage.getItem('depositHistory') || '[]');
    const depositIndex = depositHistory.findIndex(d => d.orderId === orderId);

    if (depositIndex !== -1) {
        const deposit = depositHistory[depositIndex];
        deposit.status = 'Completed';
        depositHistory[depositIndex] = deposit;
        localStorage.setItem('depositHistory', JSON.stringify(depositHistory));

        // Update user balance
        const currentBalance = parseFloat(localStorage.getItem('userBalance') || '0');
        const newBalance = currentBalance + deposit.amount;
        localStorage.setItem('userBalance', newBalance.toString());

        showToast('Deposit approved successfully', 'success');
        populateTransactionTable();
    }
}

// Process deposit rejection
function rejectDeposit(orderId) {
    const depositHistory = JSON.parse(localStorage.getItem('depositHistory') || '[]');
    const depositIndex = depositHistory.findIndex(d => d.orderId === orderId);

    if (depositIndex !== -1) {
        depositHistory[depositIndex].status = 'Rejected';
        localStorage.setItem('depositHistory', JSON.stringify(depositHistory));
        showToast('Deposit rejected', 'error');
        populateTransactionTable();
    }
}


// Show toast notification
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