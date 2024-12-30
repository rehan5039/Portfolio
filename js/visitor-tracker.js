// Admin credentials (in real world, this should be server-side)
let ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Load saved credentials on startup
const savedCredentials = localStorage.getItem('adminCredentials');
if (savedCredentials) {
    ADMIN_CREDENTIALS = JSON.parse(savedCredentials);
}

// Global variables
let currentPage = 1;
const messagesPerPage = 5;
let filteredMessages = [];
let messageChart = null;
let priorityChart = null;
let visitorChart = null;
let deviceChart = null;
let locationChart = null;
let timeSpentChart = null;

// Login functionality
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        initializeCharts(); // Initialize charts first
        loadMessages();
        loadVisitorStats(); // Load visitor statistics
        loadSettings(); // Load saved settings
        showNotification('Login successful!', 'success');
        logActivity('login', 'Admin logged in successfully');
    } else {
        showNotification('Invalid credentials!', 'error');
    }
}

function logout() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminContent').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    showNotification('Logged out successfully!', 'success');
}

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.closest('.nav-link').dataset.section;
        
        // Update active states
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
        
        e.target.closest('.nav-link').classList.add('active');
        document.getElementById(section + 'Section').classList.add('active');
    });
});

// Message handling functions
function loadMessages() {
    try {
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        updateStats(messages);
        applyFiltersAndSearch();
        if (messageChart && priorityChart) {
            updateAnalytics(messages);
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        showNotification('Error loading messages', 'error');
    }
}

function updateStats(messages) {
    const today = new Date().toLocaleDateString();
    
    const totalMessages = messages.length;
    const unreadMessages = messages.filter(msg => !msg.read).length;
    const todayMessages = messages.filter(msg => 
        new Date(msg.date).toLocaleDateString() === today
    ).length;

    document.getElementById('totalMessages').textContent = totalMessages;
    document.getElementById('unreadMessages').textContent = unreadMessages;
    document.getElementById('todayMessages').textContent = todayMessages;
}

function displayMessages(messagesToShow) {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';

    if (messagesToShow.length === 0) {
        messageList.innerHTML = '<div class="no-messages">No messages found</div>';
        return;
    }

    const startIndex = (currentPage - 1) * messagesPerPage;
    const endIndex = startIndex + messagesPerPage;
    const pageMessages = messagesToShow.slice(startIndex, endIndex);

    pageMessages.forEach((msg, index) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-item ${msg.marked ? 'marked' : ''} ${msg.read ? '' : 'unread'} ${msg.isSpam ? 'spam' : ''}`;
        
        const priorityClass = msg.priority === 'high' ? 'priority-high' : 
                            msg.priority === 'medium' ? 'priority-medium' : 'priority-low';
        
        messageDiv.innerHTML = `
            <h3>Message #${startIndex + index + 1}
                <span class="message-priority ${priorityClass}">
                    ${msg.priority || 'low'} priority
                </span>
                ${msg.isSpam ? '<span class="spam-badge"><i class="fas fa-ban"></i> Spam</span>' : ''}
            </h3>
            <p><strong>Name:</strong> ${msg.name}</p>
            <p><strong>Email:</strong> ${msg.email}</p>
            <p><strong>Message:</strong> ${msg.message}</p>
            <p><strong>Date:</strong> ${msg.date}</p>
            <div class="message-actions">
                <button onclick="toggleMarkMessage(${startIndex + index})" class="mark-btn">
                    ${msg.marked ? 'Unmark' : 'Mark'}
                </button>
                <button onclick="setPriority(${startIndex + index})" class="action-btn">
                    <i class="fas fa-flag"></i>
                </button>
                <button onclick="markAsSpam(${startIndex + index})" class="action-btn ${msg.isSpam ? 'active' : ''}">
                    <i class="fas fa-ban"></i>
                </button>
                <button onclick="deleteMessage(${startIndex + index})" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        messageList.appendChild(messageDiv);
    });

    updatePagination(messagesToShow.length);
}

function updatePagination(totalMessages) {
    const totalPages = Math.ceil(totalMessages / messagesPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = '←';
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            applyFiltersAndSearch();
        }
    };
    pagination.appendChild(prevButton);

    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = i === currentPage ? 'active' : '';
        pageButton.onclick = () => {
            currentPage = i;
            applyFiltersAndSearch();
        };
        pagination.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = '→';
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            applyFiltersAndSearch();
        }
    };
    pagination.appendChild(nextButton);
}

function deleteMessage(index) {
    if (confirm('Are you sure you want to delete this message?')) {
        try {
            const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
            messages.splice(index, 1);
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            loadMessages();
            logActivity('messages', `Deleted message #${index + 1}`);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }
}

function confirmDeleteAll() {
    if (confirm('Are you sure you want to delete all messages? This action cannot be undone!')) {
        localStorage.setItem('contactMessages', '[]');
        loadMessages();
        logActivity('messages', 'Deleted all messages');
    }
}

function toggleMarkMessage(index) {
    try {
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages[index].marked = !messages[index].marked;
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        loadMessages();
        logActivity('messages', `Marked/unmarked message #${index + 1}`);
    } catch (error) {
        console.error('Error marking message:', error);
    }
}

function applyFiltersAndSearch() {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const filterValue = document.getElementById('filterSelect').value;
    const today = new Date().toLocaleDateString();

    filteredMessages = messages.filter(msg => {
        const matchesSearch = 
            msg.name.toLowerCase().includes(searchTerm) ||
            msg.email.toLowerCase().includes(searchTerm) ||
            msg.message.toLowerCase().includes(searchTerm);

        switch (filterValue) {
            case 'unread':
                return !msg.read && matchesSearch;
            case 'marked':
                return msg.marked && matchesSearch;
            case 'today':
                return new Date(msg.date).toLocaleDateString() === today && matchesSearch;
            default:
                return matchesSearch;
        }
    });

    displayMessages(filteredMessages);
}

function exportMessages() {
    try {
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        if (messages.length === 0) {
            alert('No messages to export!');
            return;
        }

        let csv = 'Name,Email,Message,Date,Status\n';
        messages.forEach(msg => {
            const status = msg.marked ? 'Marked' : (msg.read ? 'Read' : 'Unread');
            csv += `"${msg.name}","${msg.email}","${msg.message}","${msg.date}","${status}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contact_messages_${new Date().toLocaleDateString()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('Backup created successfully!', 'success');
        logActivity('data', 'Exported contact messages');
    } catch (error) {
        console.error('Error exporting messages:', error);
        alert('Error exporting messages. Please try again.');
    }
}

// Analytics Functions
function initializeCharts() {
    try {
        const messageCtx = document.getElementById('messageChart');
        const priorityCtx = document.getElementById('priorityChart');

        if (!messageCtx || !priorityCtx) {
            console.error('Chart canvas elements not found');
            return;
        }

        // Destroy existing charts if they exist
        if (messageChart) messageChart.destroy();
        if (priorityChart) priorityChart.destroy();

        messageChart = new Chart(messageCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Messages per Day',
                    data: [],
                    borderColor: '#3498db',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });

        priorityChart = new Chart(priorityCtx, {
            type: 'doughnut',
            data: {
                labels: ['High', 'Medium', 'Low'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ['#e74c3c', '#f1c40f', '#2ecc71']
                }]
            },
            options: {
                responsive: true
            }
        });
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function updateAnalytics(messages) {
    try {
        if (!messageChart || !priorityChart) {
            console.error('Charts not initialized');
            return;
        }

        // Update message chart
        const last7Days = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString();
        }).reverse();

        const messageData = last7Days.map(date => 
            messages.filter(msg => new Date(msg.date).toLocaleDateString() === date).length
        );

        messageChart.data.labels = last7Days;
        messageChart.data.datasets[0].data = messageData;
        messageChart.update();

        // Update priority chart
        const priorities = {
            high: messages.filter(msg => msg.priority === 'high').length,
            medium: messages.filter(msg => msg.priority === 'medium').length,
            low: messages.filter(msg => msg.priority === 'low' || !msg.priority).length
        };

        priorityChart.data.datasets[0].data = [priorities.high, priorities.medium, priorities.low];
        priorityChart.update();

        // Update other analytics
        const avgResponseTime = document.getElementById('avgResponseTime');
        const spamRate = document.getElementById('spamRate');
        const satisfaction = document.getElementById('satisfaction');

        if (avgResponseTime) avgResponseTime.textContent = calculateAverageResponseTime(messages) + 'h';
        if (spamRate) spamRate.textContent = calculateSpamRate(messages) + '%';
        if (satisfaction) satisfaction.textContent = calculateSatisfaction(messages) + '%';
    } catch (error) {
        console.error('Error updating analytics:', error);
    }
}

// Analytics calculation functions
function calculateAverageResponseTime(messages) {
    if (!messages || messages.length === 0) return 0;
    const responseTimes = messages.filter(m => m.responseTime).map(m => m.responseTime);
    return responseTimes.length ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : 0;
}

function calculateSpamRate(messages) {
    if (!messages || messages.length === 0) return 0;
    const spamCount = messages.filter(m => m.isSpam).length;
    return Math.round((spamCount / messages.length) * 100);
}

function calculateSatisfaction(messages) {
    if (!messages || messages.length === 0) return 0;
    const satisfiedCount = messages.filter(m => m.satisfaction === 'positive').length;
    return Math.round((satisfiedCount / messages.length) * 100);
}

// Visitor statistics handling
function loadVisitorStats() {
    try {
        const visitors = JSON.parse(localStorage.getItem('visitorData')) || [];
        updateVisitorStats(visitors);
        updateVisitorCharts(visitors);
        displayVisitorList(visitors);
        updateCountryFilter(visitors);
    } catch (error) {
        console.error('Error loading visitor stats:', error);
        showNotification('Error loading visitor statistics', 'error');
    }
}

function updateVisitorStats(visitors) {
    const today = new Date().toLocaleDateString();
    
    // Calculate statistics
    const totalVisitors = visitors.length;
    const activeToday = visitors.filter(v => 
        new Date(v.lastActive).toLocaleDateString() === today
    ).length;
    
    const totalTimeSpent = visitors.reduce((sum, v) => sum + v.timeSpent, 0);
    const avgTimeSpent = totalVisitors ? Math.floor(totalTimeSpent / totalVisitors) : 0;
    
    const totalPageViews = visitors.reduce((sum, v) => {
        return sum + Object.values(v.pageViews).reduce((a, b) => a + b.count, 0);
    }, 0);
    
    // Update display
    document.getElementById('totalVisitors').textContent = totalVisitors;
    document.getElementById('activeToday').textContent = activeToday;
    document.getElementById('avgTimeSpent').textContent = formatTime(avgTimeSpent);
    document.getElementById('totalPageViews').textContent = totalPageViews;
}

function updateVisitorCharts(visitors) {
    try {
        updateVisitorTrendChart(visitors);
        updateDeviceChart(visitors);
        updateLocationChart(visitors);
    } catch (error) {
        console.error('Error updating visitor charts:', error);
    }
}

function updateVisitorTrendChart(visitors) {
    const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toLocaleDateString();
    }).reverse();

    const visitorTrend = last7Days.map(date =>
        visitors.filter(v => new Date(v.startTime).toLocaleDateString() === date).length
    );

    if (!visitorChart) {
        const ctx = document.getElementById('visitorChart');
        if (ctx) {
            visitorChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: last7Days,
                    datasets: [{
                        label: 'Daily Visitors',
                        data: visitorTrend,
                        borderColor: '#3498db',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
    } else {
        visitorChart.data.labels = last7Days;
        visitorChart.data.datasets[0].data = visitorTrend;
        visitorChart.update();
    }
}

function updateDeviceChart(visitors) {
    const devices = visitors.reduce((acc, v) => {
        const device = v.deviceInfo?.device || 'unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
    }, {});

    if (!deviceChart) {
        const ctx = document.getElementById('deviceChart');
        if (ctx) {
            deviceChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(devices),
                    datasets: [{
                        data: Object.values(devices),
                        backgroundColor: ['#2ecc71', '#3498db', '#9b59b6', '#f1c40f']
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }
    } else {
        deviceChart.data.labels = Object.keys(devices);
        deviceChart.data.datasets[0].data = Object.values(devices);
        deviceChart.update();
    }
}

function updateLocationChart(visitors) {
    const locations = visitors.reduce((acc, v) => {
        const country = v.location?.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {});

    if (!locationChart) {
        const ctx = document.getElementById('locationChart');
        if (ctx) {
            locationChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(locations),
                    datasets: [{
                        data: Object.values(locations),
                        backgroundColor: ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Visitor Locations'
                        }
                    }
                }
            });
        }
    } else {
        locationChart.data.labels = Object.keys(locations);
        locationChart.data.datasets[0].data = Object.values(locations);
        locationChart.update();
    }
}

function displayVisitorList(visitors) {
    const visitorList = document.getElementById('visitorList');
    if (!visitorList) return;

    // Apply filters
    const searchTerm = document.getElementById('visitorSearch').value.toLowerCase();
    const deviceFilter = document.getElementById('deviceFilter').value;
    const countryFilter = document.getElementById('countryFilter').value;

    const filteredVisitors = visitors.filter(visitor => {
        const matchesSearch = visitor.visitorId.toLowerCase().includes(searchTerm) ||
                            (visitor.ipAddress && visitor.ipAddress.includes(searchTerm)) ||
                            (visitor.location?.country || '').toLowerCase().includes(searchTerm);
        const matchesDevice = !deviceFilter || visitor.deviceInfo?.device === deviceFilter;
        const matchesCountry = !countryFilter || visitor.location?.country === countryFilter;
        return matchesSearch && matchesDevice && matchesCountry;
    });

    // Sort visitors by last active time (most recent first)
    const sortedVisitors = [...filteredVisitors].sort((a, b) => 
        new Date(b.lastActive) - new Date(a.lastActive)
    );

    visitorList.innerHTML = sortedVisitors.map(visitor => `
        <tr>
            <td>${visitor.visitorId}</td>
            <td>${visitor.ipAddress || 'Unknown'}</td>
            <td>${formatLocation(visitor.location)}</td>
            <td>${new Date(visitor.startTime).toLocaleString()}</td>
            <td>${formatTime(visitor.timeSpent)}</td>
            <td>${Object.values(visitor.pageViews).reduce((sum, page) => sum + page.count, 0)}</td>
            <td>${visitor.deviceInfo?.device || 'Unknown'}</td>
            <td>${visitor.deviceInfo?.browser || 'Unknown'}</td>
            <td>${visitor.deviceInfo?.os || 'Unknown'}</td>
            <td>${visitor.deviceInfo?.screenResolution || 'Unknown'}</td>
            <td>
                <button onclick="showVisitorDetails('${visitor.visitorId}')" class="btn-info">
                    <i class="fas fa-info-circle"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function formatLocation(location) {
    if (!location) return 'Unknown';
    return `${location.city || ''}, ${location.country || 'Unknown'}`;
}

function showVisitorDetails(visitorId) {
    const visitors = JSON.parse(localStorage.getItem('visitorData')) || [];
    const visitor = visitors.find(v => v.visitorId === visitorId);
    if (!visitor) return;

    const modal = document.getElementById('visitorModal');
    
    // Update basic info
    document.getElementById('basicInfo').innerHTML = `
        <p><strong>Visitor ID:</strong> ${visitor.visitorId}</p>
        <p><strong>IP Address:</strong> ${visitor.ipAddress || 'Unknown'}</p>
        <p><strong>First Visit:</strong> ${new Date(visitor.startTime).toLocaleString()}</p>
        <p><strong>Last Active:</strong> ${new Date(visitor.lastActive).toLocaleString()}</p>
        <p><strong>Time Spent:</strong> ${formatTime(visitor.timeSpent)}</p>
    `;

    // Update device info
    document.getElementById('deviceInfo').innerHTML = `
        <p><strong>Device Type:</strong> ${visitor.deviceInfo?.device || 'Unknown'}</p>
        <p><strong>Browser:</strong> ${visitor.deviceInfo?.browser || 'Unknown'}</p>
        <p><strong>OS:</strong> ${visitor.deviceInfo?.os || 'Unknown'}</p>
        <p><strong>Screen:</strong> ${visitor.deviceInfo?.screenResolution || 'Unknown'}</p>
        <p><strong>Language:</strong> ${visitor.deviceInfo?.language || 'Unknown'}</p>
        <p><strong>Timezone:</strong> ${visitor.deviceInfo?.timezone || 'Unknown'}</p>
    `;

    // Update location info
    document.getElementById('locationInfo').innerHTML = visitor.location ? `
        <p><strong>Country:</strong> ${visitor.location.country || 'Unknown'}</p>
        <p><strong>Region:</strong> ${visitor.location.region || 'Unknown'}</p>
        <p><strong>City:</strong> ${visitor.location.city || 'Unknown'}</p>
        <p><strong>Coordinates:</strong> ${visitor.location.latitude}, ${visitor.location.longitude}</p>
    ` : 'Location information not available';

    // Update page view info
    document.getElementById('pageViewInfo').innerHTML = `
        <table class="detail-table">
            <tr>
                <th>Page</th>
                <th>Views</th>
                <th>First Visit</th>
                <th>Last Visit</th>
            </tr>
            ${Object.entries(visitor.pageViews).map(([page, data]) => `
                <tr>
                    <td>${page || '/'}</td>
                    <td>${data.count}</td>
                    <td>${new Date(data.firstVisit).toLocaleString()}</td>
                    <td>${new Date(data.lastVisit).toLocaleString()}</td>
                </tr>
            `).join('')}
        </table>
    `;

    // Update interaction info
    document.getElementById('interactionInfo').innerHTML = visitor.interactions ? `
        <p><strong>Clicks:</strong> ${visitor.interactions.clicks}</p>
        <p><strong>Mouse Moves:</strong> ${visitor.interactions.mouseMoves}</p>
        <p><strong>Keystrokes:</strong> ${visitor.interactions.keystrokes}</p>
        <p><strong>Scrolls:</strong> ${visitor.interactions.scrolls}</p>
        <p><strong>Last Activity:</strong> ${new Date(visitor.interactions.lastActivity).toLocaleString()}</p>
    ` : 'Interaction data not available';

    // Update performance info
    document.getElementById('performanceInfo').innerHTML = visitor.performance ? `
        <p><strong>Page Load Time:</strong> ${visitor.performance.pageLoadTime}ms</p>
        <p><strong>DNS Time:</strong> ${visitor.performance.dnsTime}ms</p>
        <p><strong>Server Response Time:</strong> ${visitor.performance.serverResponseTime}ms</p>
        <p><strong>DOM Load Time:</strong> ${visitor.performance.domLoadTime}ms</p>
    ` : 'Performance data not available';

    modal.style.display = 'block';
}

function updateCountryFilter(visitors) {
    const countryFilter = document.getElementById('countryFilter');
    const countries = [...new Set(visitors
        .map(v => v.location?.country)
        .filter(country => country)
    )].sort();

    countryFilter.innerHTML = `
        <option value="">All Countries</option>
        ${countries.map(country => `
            <option value="${country}">${country}</option>
        `).join('')}
    `;
}

// Add event listeners for filters
document.getElementById('visitorSearch')?.addEventListener('input', () => {
    const visitors = JSON.parse(localStorage.getItem('visitorData')) || [];
    displayVisitorList(visitors);
});

document.getElementById('deviceFilter')?.addEventListener('change', () => {
    const visitors = JSON.parse(localStorage.getItem('visitorData')) || [];
    displayVisitorList(visitors);
});

document.getElementById('countryFilter')?.addEventListener('change', () => {
    const visitors = JSON.parse(localStorage.getItem('visitorData')) || [];
    displayVisitorList(visitors);
});

// Modal close button
document.querySelector('.close')?.addEventListener('click', () => {
    document.getElementById('visitorModal').style.display = 'none';
});

window.onclick = function(event) {
    const modal = document.getElementById('visitorModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Settings Management Functions
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || getDefaultSettings();
    
    // Load Account Settings
    document.getElementById('adminUsername').value = settings.account.username || '';
    
    // Load Notification Settings
    document.getElementById('notificationEmail').value = settings.notifications.email || '';
    document.getElementById('emailNotifications').checked = settings.notifications.emailEnabled;
    document.getElementById('browserNotifications').checked = settings.notifications.browserEnabled;
    
    // Load Message Settings
    document.getElementById('messageRetention').value = settings.messages.retentionDays;
    document.getElementById('autoDeleteSpam').checked = settings.messages.autoDeleteSpam;
    document.getElementById('autoArchive').checked = settings.messages.autoArchive;
    
    // Load Analytics Settings
    document.getElementById('trackVisitors').checked = settings.analytics.trackVisitors;
    document.getElementById('collectDeviceInfo').checked = settings.analytics.collectDeviceInfo;
    document.getElementById('analyticsRetention').value = settings.analytics.retentionDays;
}

function getDefaultSettings() {
    return {
        account: {
            username: 'admin'
        },
        notifications: {
            email: '',
            emailEnabled: false,
            browserEnabled: true
        },
        messages: {
            retentionDays: 90,
            autoDeleteSpam: true,
            autoArchive: false
        },
        analytics: {
            trackVisitors: true,
            collectDeviceInfo: true,
            retentionDays: 90
        }
    };
}

function updateAdminCredentials() {
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    
    if (!username || !password) {
        showNotification('Please enter both username and password', 'error');
        return;
    }

    if (username.length < 3 || password.length < 6) {
        showNotification('Username must be at least 3 characters and password at least 6 characters', 'error');
        return;
    }
    
    // Update credentials in memory and storage
    ADMIN_CREDENTIALS.username = username;
    ADMIN_CREDENTIALS.password = password;
    localStorage.setItem('adminCredentials', JSON.stringify(ADMIN_CREDENTIALS));
    
    // Clear the password field
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
    
    showNotification('Admin credentials updated successfully! Please remember your new login details.', 'success');
    logActivity('settings', 'Admin credentials updated');
}

function updateNotificationSettings() {
    const email = document.getElementById('notificationEmail').value;
    const emailEnabled = document.getElementById('emailNotifications').checked;
    const browserEnabled = document.getElementById('browserNotifications').checked;
    
    if (emailEnabled && !email) {
        showNotification('Please enter an email address for notifications', 'error');
        return;
    }
    
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || getDefaultSettings();
    settings.notifications = {
        email,
        emailEnabled,
        browserEnabled
    };
    
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    showNotification('Notification settings updated successfully', 'success');
    
    if (browserEnabled) {
        requestBrowserNotificationPermission();
    }
}

function updateMessageSettings() {
    const retentionDays = document.getElementById('messageRetention').value;
    const autoDeleteSpam = document.getElementById('autoDeleteSpam').checked;
    const autoArchive = document.getElementById('autoArchive').checked;
    
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || getDefaultSettings();
    settings.messages = {
        retentionDays,
        autoDeleteSpam,
        autoArchive
    };
    
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    showNotification('Message settings updated successfully', 'success');
    
    // Apply message retention policy
    if (autoDeleteSpam || autoArchive) {
        applyMessageRetentionPolicy();
    }
}

function updateAnalyticsSettings() {
    const trackVisitors = document.getElementById('trackVisitors').checked;
    const collectDeviceInfo = document.getElementById('collectDeviceInfo').checked;
    const retentionDays = document.getElementById('analyticsRetention').value;
    
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || getDefaultSettings();
    settings.analytics = {
        trackVisitors,
        collectDeviceInfo,
        retentionDays
    };
    
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    showNotification('Analytics settings updated successfully', 'success');
    
    // Apply analytics retention policy
    applyAnalyticsRetentionPolicy();
}

function applyMessageRetentionPolicy() {
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || getDefaultSettings();
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - settings.messages.retentionDays);
    
    const filteredMessages = messages.filter(message => {
        const messageDate = new Date(message.date);
        if (settings.messages.autoDeleteSpam && message.isSpam) {
            return false;
        }
        if (settings.messages.autoArchive && messageDate < retentionDate) {
            return false;
        }
        return true;
    });
    
    localStorage.setItem('contactMessages', JSON.stringify(filteredMessages));
    loadMessages();
}

function applyAnalyticsRetentionPolicy() {
    const settings = JSON.parse(localStorage.getItem('adminSettings')) || getDefaultSettings();
    const visitors = JSON.parse(localStorage.getItem('visitorData')) || [];
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - settings.analytics.retentionDays);
    
    const filteredVisitors = visitors.filter(visitor => {
        const visitDate = new Date(visitor.lastActive);
        return visitDate >= retentionDate;
    });
    
    localStorage.setItem('visitorData', JSON.stringify(filteredVisitors));
    loadVisitorStats();
}

function requestBrowserNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification('Browser notifications enabled', 'success');
            } else {
                document.getElementById('browserNotifications').checked = false;
                showNotification('Browser notification permission denied', 'error');
            }
        });
    } else {
        document.getElementById('browserNotifications').checked = false;
        showNotification('Browser notifications not supported', 'error');
    }
}

// Backup Functions
function createBackup() {
    try {
        const backup = {
            timestamp: new Date().toISOString(),
            contactMessages: JSON.parse(localStorage.getItem('contactMessages') || '[]'),
            visitorData: JSON.parse(localStorage.getItem('visitorData') || '[]'),
            adminSettings: JSON.parse(localStorage.getItem('adminSettings') || '{}'),
            analyticsData: JSON.parse(localStorage.getItem('analyticsData') || '{}')
        };

        // Create backup file
        const backupStr = JSON.stringify(backup, null, 2);
        const blob = new Blob([backupStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `admin_backup_${date}.json`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);

        showNotification('Backup created successfully', 'success');
        logActivity('data', 'Created backup');
    } catch (error) {
        console.error('Error creating backup:', error);
        showNotification('Error creating backup. Please try again.', 'error');
    }
}

function restoreBackup() {
    try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const backup = JSON.parse(e.target.result);
                    
                    // Validate backup data
                    if (!backup.timestamp || !backup.contactMessages) {
                        throw new Error('Invalid backup file format');
                    }
                    
                    // Restore data
                    localStorage.setItem('contactMessages', JSON.stringify(backup.contactMessages));
                    if (backup.visitorData) localStorage.setItem('visitorData', JSON.stringify(backup.visitorData));
                    if (backup.adminSettings) localStorage.setItem('adminSettings', JSON.stringify(backup.adminSettings));
                    if (backup.analyticsData) localStorage.setItem('analyticsData', JSON.stringify(backup.analyticsData));
                    
                    showNotification('Backup restored successfully', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                    logActivity('data', 'Restored backup');
                } catch (error) {
                    console.error('Error parsing backup:', error);
                    showNotification('Invalid backup file. Please try again.', 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    } catch (error) {
        console.error('Error restoring backup:', error);
        showNotification('Error restoring backup. Please try again.', 'error');
    }
}

// Data Management Functions
function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        // Clear all localStorage data
        localStorage.clear();

        // Reset admin credentials to default
        ADMIN_CREDENTIALS = {
            username: 'admin',
            password: 'admin123'
        };

        // Clear input fields if they exist
        const usernameInput = document.getElementById('adminUsername');
        const passwordInput = document.getElementById('adminPassword');
        if (usernameInput) usernameInput.value = '';
        if (passwordInput) passwordInput.value = '';

        // Reinitialize necessary data structures
        currentPage = 1;
        localStorage.setItem('messages', JSON.stringify([]));
        localStorage.setItem('visitorData', JSON.stringify([]));
        localStorage.setItem('adminSettings', JSON.stringify(getDefaultSettings()));

        // Reset UI
        loadMessages();
        loadVisitorStats();
        loadSettings();
        updateAnalytics([]);
        
        showNotification('All data has been cleared and settings reset to default', 'success');
        logActivity('data', 'Cleared all data');
        
        // Optional: Redirect to login page after clearing data
        setTimeout(() => {
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('adminContent').style.display = 'none';
        }, 1500);
    }
}

// Utility Functions
function formatTime(seconds) {
    if (!seconds) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Performance Calculation Functions
function calculateAverageTimeOnSite(visitors) {
    if (!visitors || visitors.length === 0) return 0;
    
    const validVisitors = visitors.filter(v => v.timeSpent && v.timeSpent > 0);
    if (validVisitors.length === 0) return 0;
    
    const totalTime = validVisitors.reduce((sum, v) => sum + v.timeSpent, 0);
    return Math.round(totalTime / validVisitors.length);
}

function calculateBounceRate(visitors) {
    if (!visitors || visitors.length === 0) return '0%';
    
    const bounceThreshold = 10; // 10 seconds threshold for bounce
    const bouncedVisitors = visitors.filter(v => !v.timeSpent || v.timeSpent < bounceThreshold);
    const bounceRate = (bouncedVisitors.length / visitors.length) * 100;
    
    return bounceRate.toFixed(1) + '%';
}

function calculateSpamRate(messages) {
    if (!messages || messages.length === 0) return '0%';
    
    const spamMessages = messages.filter(m => m.isSpam);
    const spamRate = (spamMessages.length / messages.length) * 100;
    
    return spamRate.toFixed(1) + '%';
}

function calculateAverageResponseTime(messages) {
    if (!messages || messages.length === 0) return '0';
    
    const respondedMessages = messages.filter(m => m.responseTime);
    if (respondedMessages.length === 0) return '0';
    
    const totalResponseTime = respondedMessages.reduce((sum, m) => sum + m.responseTime, 0);
    const averageTime = Math.round(totalResponseTime / respondedMessages.length);
    
    return formatTime(averageTime);
}

// Update performance metrics calculation
function calculatePerformanceMetrics() {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    const visitors = JSON.parse(localStorage.getItem('visitorData')) || [];
    
    const today = new Date().toISOString().split('T')[0];
    const todayVisitors = visitors.filter(v => v.timestamp?.startsWith(today));
    const todayMessages = messages.filter(m => m.date?.startsWith(today));
    
    return {
        'Total Messages': messages.length,
        'Messages Today': todayMessages.length,
        'Spam Rate': calculateSpamRate(messages),
        'Average Response Time': calculateAverageResponseTime(messages),
        'Total Visitors': visitors.length,
        'Visitors Today': todayVisitors.length,
        'Average Time on Site': formatTime(calculateAverageTimeOnSite(visitors)),
        'Bounce Rate': calculateBounceRate(visitors),
        'Top Countries': getTopCountries(visitors),
        'Top Browsers': getTopBrowsers(visitors)
    };
}

function getTopCountries(visitors, limit = 3) {
    if (!visitors || visitors.length === 0) return 'None';
    
    const countries = visitors.reduce((acc, v) => {
        const country = v.location?.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {});
    
    return Object.entries(countries)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([country, count]) => `${country} (${count})`)
        .join(', ') || 'None';
}

function getTopBrowsers(visitors, limit = 3) {
    if (!visitors || visitors.length === 0) return 'None';
    
    const browsers = visitors.reduce((acc, v) => {
        const browser = v.browser?.name || 'Unknown';
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
    }, {});
    
    return Object.entries(browsers)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([browser, count]) => `${browser} (${count})`)
        .join(', ') || 'None';
}

// Add styles for spam messages
const spamStyles = `
    .message-item.spam {
        background-color: #fff5f5;
        border-left: 4px solid #dc3545;
    }
    .spam-badge {
        background-color: #dc3545;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        margin-left: 10px;
        font-size: 0.8em;
    }
    .action-btn.active {
        background-color: #dc3545;
        color: white;
    }
`;

// Add spam styles to existing styles
const spamStyleSheet = document.createElement('style');
spamStyleSheet.textContent = spamStyles;
document.head.appendChild(spamStyleSheet);

// Activity Log Functions
function logActivity(type, description) {
    const activities = JSON.parse(localStorage.getItem('activityLog')) || [];
    activities.unshift({
        type,
        description,
        timestamp: new Date().toISOString(),
        user: ADMIN_CREDENTIALS.username
    });
    localStorage.setItem('activityLog', JSON.stringify(activities));
    updateActivityLog();
}

function updateActivityLog() {
    const activities = JSON.parse(localStorage.getItem('activityLog')) || [];
    const activityLog = document.getElementById('activityLog');
    const selectedType = document.getElementById('activityType').value;
    const selectedDate = document.getElementById('activityDate').value;

    let filteredActivities = activities;
    
    // Apply type filter
    if (selectedType !== 'all') {
        filteredActivities = filteredActivities.filter(a => a.type === selectedType);
    }
    
    // Apply date filter
    if (selectedDate) {
        const dateStr = new Date(selectedDate).toDateString();
        filteredActivities = filteredActivities.filter(a => 
            new Date(a.timestamp).toDateString() === dateStr
        );
    }

    activityLog.innerHTML = filteredActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="fas ${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-description">${activity.description}</div>
                <div class="activity-time">
                    <i class="fas fa-user"></i> ${activity.user} | 
                    <i class="fas fa-clock"></i> ${formatActivityTime(activity.timestamp)}
                </div>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = {
        login: 'fa-sign-in-alt',
        settings: 'fa-cog',
        messages: 'fa-envelope',
        data: 'fa-database'
    };
    return icons[type] || 'fa-info-circle';
}

function formatActivityTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // difference in seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return date.toLocaleDateString();
}

function filterActivityLog() {
    updateActivityLog();
}

function clearActivityLog() {
    if (confirm('Are you sure you want to clear the activity log?')) {
        localStorage.setItem('activityLog', '[]');
        updateActivityLog();
        showNotification('Activity log cleared successfully', 'success');
        logActivity('data', 'Cleared activity log');
    }
}

function exportActivityLog() {
    const activities = JSON.parse(localStorage.getItem('activityLog')) || [];
    const csv = [
        ['Timestamp', 'Type', 'User', 'Description'],
        ...activities.map(a => [
            a.timestamp,
            a.type,
            a.user,
            a.description
        ])
    ].map(row => row.join(',')).join('\n');

    downloadFile('activity_log.csv', csv);
    logActivity('data', 'Exported activity log');
}

// Report Generation Functions
function generateReport(type) {
    const data = gatherReportData(type);
    const report = formatReportData(type, data);
    downloadFile(`${type}_report.csv`, report);
    showNotification(`${type} report generated successfully`, 'success');
    logActivity('data', `Generated ${type} report`);
}

function generateCustomReport() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    const metrics = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
        .map(cb => cb.value);

    if (!startDate || !endDate) {
        showNotification('Please select both start and end dates', 'error');
        return;
    }

    if (metrics.length === 0) {
        showNotification('Please select at least one metric', 'error');
        return;
    }

    const reportData = {};
    metrics.forEach(metric => {
        reportData[metric] = gatherReportData(metric, startDate, endDate);
    });

    const report = formatCustomReport(reportData, startDate, endDate);
    downloadFile('custom_report.csv', report);
    showNotification('Custom report generated successfully', 'success');
    logActivity('data', 'Generated custom report');
}

function gatherReportData(type, startDate = null, endDate = null) {
    let data;
    switch(type) {
        case 'messages':
            data = JSON.parse(localStorage.getItem('contactMessages')) || [];
            break;
        case 'visitors':
            data = JSON.parse(localStorage.getItem('visitorData')) || [];
            break;
        case 'performance':
            data = calculatePerformanceMetrics();
            break;
    }

    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        data = data.filter(item => {
            const date = new Date(item.timestamp || item.date);
            return date >= start && date <= end;
        });
    }

    return data;
}

function formatReportData(type, data) {
    let csv = '';
    switch(type) {
        case 'messages':
            csv = formatMessagesReport(data);
            break;
        case 'visitors':
            csv = formatVisitorsReport(data);
            break;
        case 'performance':
            csv = formatPerformanceReport(data);
            break;
    }
    return csv;
}

function formatMessagesReport(messages) {
    return [
        ['Date', 'Name', 'Email', 'Message', 'Priority', 'Status'],
        ...messages.map(m => [
            m.date,
            m.name,
            m.email,
            m.message,
            m.priority || 'low',
            m.marked ? 'Marked' : 'Unmarked'
        ])
    ].map(row => row.join(',')).join('\n');
}

function formatVisitorsReport(visitors) {
    return [
        ['Date', 'IP', 'Country', 'City', 'Device', 'Browser', 'Time Spent'],
        ...visitors.map(v => [
            v.timestamp,
            v.ip,
            v.location?.country || 'Unknown',
            v.location?.city || 'Unknown',
            v.device?.type || 'Unknown',
            v.browser?.name || 'Unknown',
            formatTime(v.timeSpent || 0)
        ])
    ].map(row => row.join(',')).join('\n');
}

function formatPerformanceReport(metrics) {
    return [
        ['Metric', 'Value'],
        ...Object.entries(metrics)
    ].map(row => row.join(',')).join('\n');
}

function formatCustomReport(data, startDate, endDate) {
    let csv = `Custom Report (${startDate} to ${endDate})\n\n`;
    
    Object.entries(data).forEach(([metric, values]) => {
        csv += `\n${metric.toUpperCase()} METRICS\n`;
        csv += formatReportData(metric, values);
        csv += '\n\n';
    });
    
    return csv;
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Add CSS styles for modal
const styles = `
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
    }
    .modal-content {
        background-color: #fefefe;
        margin: 5% auto;
        padding: 20px;
        border-radius: 8px;
        width: 80%;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
    }
    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
    }
    .close:hover {
        color: #000;
    }
    .visitor-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }
    .detail-section {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
    }
    .detail-section h3 {
        margin-top: 0;
        color: #2c3e50;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
    }
    .detail-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }
    .detail-table th,
    .detail-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    .detail-table th {
        background: #f5f5f5;
    }
    .table-filters {
        margin-bottom: 20px;
        display: flex;
        gap: 10px;
        align-items: center;
    }
    .search-input {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        width: 200px;
    }
    .filter-select {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    .table-wrapper {
        overflow-x: auto;
    }
    .btn-info {
        background: #3498db;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }
    .btn-info:hover {
        background: #2980b9;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Event listeners
document.getElementById('searchBox').addEventListener('input', () => {
    currentPage = 1;
    applyFiltersAndSearch();
});

document.getElementById('filterSelect').addEventListener('change', () => {
    currentPage = 1;
    applyFiltersAndSearch();
});

// Auto-refresh for visitor stats
setInterval(() => {
    if (document.getElementById('visitorsSection').classList.contains('active')) {
        loadVisitorStats();
    }
}, 30000); // Refresh every 30 seconds

// Initialize when document loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in (in real world, use proper session management)
    const isLoggedIn = false; // Set this based on your authentication logic
    if (isLoggedIn) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        initializeCharts(); // Initialize charts first
        loadMessages();
        loadVisitorStats(); // Load visitor statistics
        loadSettings(); // Load saved settings
    }
});

function setPriority(index) {
    const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    if (index >= 0 && index < messages.length) {
        const priorities = ['low', 'medium', 'high'];
        const currentPriority = messages[index].priority || 'low';
        const currentIndex = priorities.indexOf(currentPriority);
        const nextIndex = (currentIndex + 1) % priorities.length;
        messages[index].priority = priorities[nextIndex];
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        loadMessages(); // Refresh the messages display
        showNotification(`Message priority set to ${priorities[nextIndex]}`, 'success');
        logActivity('messages', `Set message #${index + 1} priority to ${priorities[nextIndex]}`);
    }
}

function markAsSpam(index) {
    try {
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        if (index >= 0 && index < messages.length) {
            messages[index].isSpam = !messages[index].isSpam;
            messages[index].marked = messages[index].isSpam; // Auto-mark spam messages
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            loadMessages();
            
            const action = messages[index].isSpam ? 'marked as spam' : 'unmarked as spam';
            showNotification(`Message ${action} successfully`, 'success');
            logActivity('messages', `Message #${index + 1} ${action}`);
            
            // Update spam rate in analytics
            updateAnalytics(messages);
        }
    } catch (error) {
        console.error('Error marking message as spam:', error);
        showNotification('Error marking message as spam', 'error');
    }
}
