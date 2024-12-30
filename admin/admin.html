<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .header h1 {
            margin: 0;
            color: #333;
        }
        .stats {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        .stat-card {
            background: #fff;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            flex: 1;
        }
        .stat-card h3 {
            margin: 0 0 10px 0;
            color: #666;
        }
        .stat-card .number {
            font-size: 24px;
            font-weight: bold;
            color: #2196F3;
        }
        .controls {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        .search-box {
            flex: 1;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .filter-select {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .action-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background: #3498db;
            color: white;
            cursor: pointer;
            transition: 0.3s;
        }
        .action-btn.export {
            background-color: #4CAF50;
        }
        .action-btn.delete-all {
            background-color: #f44336;
        }
        .danger-btn {
            background: #e74c3c;
        }
        .danger-btn:hover {
            background: #c0392b;
        }
        .action-btn:hover {
            background: #2980b9;
        }
        .message-item {
            border: 1px solid #ddd;
            margin: 10px 0;
            padding: 15px;
            border-radius: 4px;
            position: relative;
        }
        .message-item h3 {
            margin-top: 0;
            color: #2196F3;
        }
        .message-actions {
            position: absolute;
            top: 15px;
            right: 15px;
            display: flex;
            gap: 10px;
        }
        .delete-btn {
            background-color: #ff4444;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
        }
        .mark-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
        }
        .delete-btn:hover {
            background-color: #cc0000;
        }
        .mark-btn:hover {
            background-color: #388E3C;
        }
        .marked {
            background-color: #e3f2fd;
        }
        .pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
        }
        .pagination button {
            padding: 5px 10px;
            border: 1px solid #ddd;
            background: white;
            cursor: pointer;
        }
        .pagination button.active {
            background: #2196F3;
            color: white;
            border-color: #2196F3;
        }
        .no-messages {
            text-align: center;
            color: #666;
            padding: 20px;
        }
        #loginForm {
            max-width: 400px;
            margin: 100px auto;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
        }
        .form-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        #adminContent {
            display: none;
        }
        .dashboard-nav {
            background: #2c3e50;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .nav-links {
            display: flex;
            gap: 20px;
        }
        .nav-link {
            color: white;
            text-decoration: none;
            padding: 8px 15px;
            border-radius: 4px;
            transition: background 0.3s;
        }
        .nav-link:hover {
            background: #34495e;
        }
        .nav-link.active {
            background: #3498db;
        }
        .dashboard-section {
            display: none;
        }
        .dashboard-section.active {
            display: block;
        }
        .chart-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 20px 0;
        }
        .chart {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 4px;
            color: white;
            display: none;
        }
        .notification.success {
            background: #2ecc71;
        }
        .notification.error {
            background: #e74c3c;
        }
        .settings-form {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .backup-section {
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-top: 20px;
        }
        
        .backup-section h2 {
            margin-top: 0;
            color: #2c3e50;
            font-size: 1.5em;
            margin-bottom: 15px;
        }
        
        .backup-section button {
            margin: 10px 0 20px 0;
        }
        
        .backup-section input[type="file"] {
            display: none;
        }
        
        .backup-section .file-input-label {
            display: inline-block;
            padding: 8px 16px;
            background: #3498db;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 10px;
            transition: 0.3s;
        }
        
        .backup-section .file-input-label:hover {
            background: #2980b9;
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
            color: white;
        }
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #3498db;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .message-priority {
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 12px;
            margin-left: 10px;
        }
        .priority-high {
            background: #e74c3c;
            color: white;
        }
        .priority-medium {
            background: #f1c40f;
            color: black;
        }
        .priority-low {
            background: #2ecc71;
            color: white;
        }
        .visitor-list-container {
            margin-top: 20px;
        }
        .visitor-table {
            width: 100%;
            border-collapse: collapse;
        }
        .visitor-table th, .visitor-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        .visitor-table th {
            background: #f5f5f5;
        }
        /* Settings Styles */
        .settings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        .settings-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .settings-card h3 {
            margin-top: 0;
            color: #2c3e50;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        .settings-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .settings-form label {
            font-weight: bold;
            color: #34495e;
        }
        .settings-form input[type="text"],
        .settings-form input[type="password"],
        .settings-form input[type="email"],
        .settings-form select {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        .settings-form .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* Activity Log Styles */
        .activity-list {
            max-height: 500px;
            overflow-y: auto;
        }
        .activity-item {
            padding: 15px;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .activity-icon.login { background-color: #4CAF50; }
        .activity-icon.settings { background-color: #2196F3; }
        .activity-icon.messages { background-color: #FF9800; }
        .activity-icon.data { background-color: #F44336; }
        .activity-content {
            flex: 1;
        }
        .activity-time {
            color: #666;
            font-size: 0.9em;
        }
        .activity-filters {
            margin-bottom: 20px;
            display: flex;
            gap: 15px;
        }
        .activity-filters select,
        .activity-filters input {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        /* Reports Styles */
        .reports-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .report-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .report-actions {
            margin-top: 15px;
        }
        .report-form {
            margin-top: 15px;
        }
        .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 10px;
        }
        .checkbox-group label {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    </style>
</head>
<body>
    <div id="loginForm">
        <h2>Admin Login</h2>
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" required>
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" required>
        </div>
        <button onclick="login()" class="action-btn">Login</button>
    </div>

    <div id="adminContent" class="container">
        <div class="dashboard-nav">
            <div class="nav-links">
                <a href="#" class="nav-link active" data-section="messages">
                    <i class="fas fa-envelope"></i> Messages
                </a>
                <a href="#" class="nav-link" data-section="visitors">
                    <i class="fas fa-users"></i> Visitors
                </a>
                <a href="#" class="nav-link" data-section="analytics">
                    <i class="fas fa-chart-line"></i> Analytics
                </a>
                <a href="#" class="nav-link" data-section="settings">
                    <i class="fas fa-cog"></i> Settings
                </a>
                <a href="#" class="nav-link" data-section="backup">
                    <i class="fas fa-database"></i> Backup
                </a>
                <a href="#" class="nav-link" data-section="activity">
                    <i class="fas fa-history"></i> Activity Log
                </a>
                <a href="#" class="nav-link" data-section="reports">
                    <i class="fas fa-file-alt"></i> Reports
                </a>
            </div>
            <div class="user-info">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <span id="adminName">Admin</span>
                <button onclick="logout()" class="action-btn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>

        <!-- Messages Section -->
        <div id="messagesSection" class="dashboard-section active">
            <div class="header">
                <h1><i class="fas fa-envelope"></i> Contact Form Messages</h1>
            </div>

            <div class="stats">
                <div class="stat-card">
                    <h3>Total Messages</h3>
                    <div id="totalMessages" class="number">0</div>
                </div>
                <div class="stat-card">
                    <h3>Unread Messages</h3>
                    <div id="unreadMessages" class="number">0</div>
                </div>
                <div class="stat-card">
                    <h3>Today's Messages</h3>
                    <div id="todayMessages" class="number">0</div>
                </div>
            </div>

            <div class="controls">
                <input type="text" id="searchBox" class="search-box" placeholder="Search messages...">
                <select id="filterSelect" class="filter-select">
                    <option value="all">All Messages</option>
                    <option value="unread">Unread Only</option>
                    <option value="marked">Marked Only</option>
                    <option value="today">Today Only</option>
                    <option value="high-priority">High Priority</option>
                    <option value="spam">Spam</option>
                </select>
                <select id="sortSelect" class="filter-select">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priority">By Priority</option>
                </select>
                <button onclick="exportMessages()" class="action-btn export">
                    <i class="fas fa-file-export"></i> Export
                </button>
                <button onclick="confirmDeleteAll()" class="action-btn delete-all">
                    <i class="fas fa-trash"></i> Delete All
                </button>
            </div>

            <div id="messageList">
                <!-- Messages will be loaded here -->
            </div>

            <div class="pagination" id="pagination">
                <!-- Pagination buttons -->
            </div>
        </div>

        <!-- Analytics Section -->
        <div id="analyticsSection" class="dashboard-section">
            <div class="header">
                <h1><i class="fas fa-chart-bar"></i> Analytics</h1>
            </div>
            <div class="chart-container">
                <div class="chart">
                    <canvas id="messageChart"></canvas>
                </div>
                <div class="chart">
                    <canvas id="priorityChart"></canvas>
                </div>
            </div>
            <div class="stats">
                <div class="stat-card">
                    <h3>Average Response Time</h3>
                    <div id="avgResponseTime" class="number">0h</div>
                </div>
                <div class="stat-card">
                    <h3>Spam Detection Rate</h3>
                    <div id="spamRate" class="number">0%</div>
                </div>
                <div class="stat-card">
                    <h3>User Satisfaction</h3>
                    <div id="satisfaction" class="number">0%</div>
                </div>
            </div>
        </div>

        <!-- Visitors Section -->
        <div id="visitorsSection" class="dashboard-section">
            <div class="header">
                <h1><i class="fas fa-users"></i> Website Visitors</h1>
            </div>
            
            <div class="stats">
                <div class="stat-card">
                    <h3>Total Visitors</h3>
                    <div id="totalVisitors" class="number">0</div>
                </div>
                <div class="stat-card">
                    <h3>Active Today</h3>
                    <div id="activeToday" class="number">0</div>
                </div>
                <div class="stat-card">
                    <h3>Average Time Spent</h3>
                    <div id="avgTimeSpent" class="number">0m</div>
                </div>
                <div class="stat-card">
                    <h3>Total Page Views</h3>
                    <div id="totalPageViews" class="number">0</div>
                </div>
            </div>

            <div class="chart-container">
                <div class="chart">
                    <canvas id="visitorChart"></canvas>
                </div>
                <div class="chart">
                    <canvas id="deviceChart"></canvas>
                </div>
                <div class="chart">
                    <canvas id="locationChart"></canvas>
                </div>
            </div>

            <div class="visitor-list-container">
                <h2>Recent Visitors</h2>
                <div class="table-filters">
                    <input type="text" id="visitorSearch" placeholder="Search visitors..." class="search-input">
                    <select id="deviceFilter" class="filter-select">
                        <option value="">All Devices</option>
                        <option value="desktop">Desktop</option>
                        <option value="mobile">Mobile</option>
                        <option value="tablet">Tablet</option>
                    </select>
                    <select id="countryFilter" class="filter-select">
                        <option value="">All Countries</option>
                    </select>
                </div>
                <div class="table-wrapper">
                    <table class="visitor-table">
                        <thead>
                            <tr>
                                <th>Visitor ID</th>
                                <th>IP Address</th>
                                <th>Location</th>
                                <th>Visit Time</th>
                                <th>Time Spent</th>
                                <th>Pages Viewed</th>
                                <th>Device Info</th>
                                <th>Browser</th>
                                <th>OS</th>
                                <th>Screen</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="visitorList">
                            <!-- Visitor data will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Visitor Details Modal -->
            <div id="visitorModal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Visitor Details</h2>
                    <div class="visitor-details">
                        <div class="detail-section">
                            <h3>Basic Information</h3>
                            <div id="basicInfo"></div>
                        </div>
                        <div class="detail-section">
                            <h3>Device Information</h3>
                            <div id="deviceInfo"></div>
                        </div>
                        <div class="detail-section">
                            <h3>Location Information</h3>
                            <div id="locationInfo"></div>
                        </div>
                        <div class="detail-section">
                            <h3>Page Views</h3>
                            <div id="pageViewInfo"></div>
                        </div>
                        <div class="detail-section">
                            <h3>User Interactions</h3>
                            <div id="interactionInfo"></div>
                        </div>
                        <div class="detail-section">
                            <h3>Performance Metrics</h3>
                            <div id="performanceInfo"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Settings Section -->
        <div id="settingsSection" class="dashboard-section">
            <div class="header">
                <h1><i class="fas fa-cog"></i> Settings</h1>
            </div>
            <div class="settings-grid">
                <div class="settings-card">
                    <h3>Account Settings</h3>
                    <div class="settings-form">
                        <div>
                            <label for="adminUsername">Admin Username</label>
                            <input type="text" id="adminUsername" placeholder="Enter new username">
                        </div>
                        <div>
                            <label for="adminPassword">Admin Password</label>
                            <input type="password" id="adminPassword" placeholder="Enter new password">
                        </div>
                        <button onclick="updateAdminCredentials()" class="action-btn">
                            Update Credentials
                        </button>
                    </div>
                </div>

                <div class="settings-card">
                    <h3>Notification Settings</h3>
                    <div class="settings-form">
                        <div>
                            <label for="notificationEmail">Notification Email</label>
                            <input type="email" id="notificationEmail" placeholder="Enter email for notifications">
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" id="emailNotifications">
                            <label for="emailNotifications">Enable Email Notifications</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" id="browserNotifications">
                            <label for="browserNotifications">Enable Browser Notifications</label>
                        </div>
                        <button onclick="updateNotificationSettings()" class="action-btn">
                            Save Notification Settings
                        </button>
                    </div>
                </div>

                <div class="settings-card">
                    <h3>Message Settings</h3>
                    <div class="settings-form">
                        <div>
                            <label for="messageRetention">Message Retention Period</label>
                            <select id="messageRetention">
                                <option value="30">30 days</option>
                                <option value="60">60 days</option>
                                <option value="90">90 days</option>
                                <option value="180">180 days</option>
                                <option value="365">1 year</option>
                            </select>
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" id="autoDeleteSpam">
                            <label for="autoDeleteSpam">Auto-delete Spam Messages</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" id="autoArchive">
                            <label for="autoArchive">Auto-archive Old Messages</label>
                        </div>
                        <button onclick="updateMessageSettings()" class="action-btn">
                            Save Message Settings
                        </button>
                    </div>
                </div>

                <div class="settings-card">
                    <h3>Analytics Settings</h3>
                    <div class="settings-form">
                        <div class="checkbox-group">
                            <input type="checkbox" id="trackVisitors">
                            <label for="trackVisitors">Track Website Visitors</label>
                        </div>
                        <div class="checkbox-group">
                            <input type="checkbox" id="collectDeviceInfo">
                            <label for="collectDeviceInfo">Collect Device Information</label>
                        </div>
                        <div>
                            <label for="analyticsRetention">Analytics Data Retention</label>
                            <select id="analyticsRetention">
                                <option value="30">30 days</option>
                                <option value="90">90 days</option>
                                <option value="180">180 days</option>
                                <option value="365">1 year</option>
                            </select>
                        </div>
                        <button onclick="updateAnalyticsSettings()" class="action-btn">
                            Save Analytics Settings
                        </button>
                    </div>
                </div>

                <div class="settings-card">
                    <h3>Data Management</h3>
                    <div class="settings-form">
                        <div class="form-group">
                            <button onclick="clearAllData()" class="action-btn danger-btn">
                                <i class="fas fa-trash"></i> Clear All Data
                            </button>
                            <p class="help-text">Warning: This will permanently delete all messages, visitor data, and settings.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Backup Section -->
        <div id="backupSection" class="dashboard-section">
            <div class="header">
                <h1><i class="fas fa-database"></i> Backup & Restore</h1>
            </div>
            <div class="backup-section">
                <div class="settings-card">
                    <h2><i class="fas fa-download"></i> Create Backup</h2>
                    <p>Download a backup of all your admin panel data including messages, visitor data, and settings.</p>
                    <button onclick="createBackup()" class="action-btn">
                        <i class="fas fa-download"></i> Download Backup
                    </button>
                </div>
                
                <div class="settings-card">
                    <h2><i class="fas fa-upload"></i> Restore Backup</h2>
                    <p>Restore your admin panel data from a previously created backup file.</p>
                    <button onclick="restoreBackup()" class="action-btn">
                        <i class="fas fa-upload"></i> Upload Backup File
                    </button>
                </div>
            </div>
        </div>

        <!-- Activity Log Section -->
        <div id="activitySection" class="dashboard-section">
            <div class="header">
                <h1><i class="fas fa-history"></i> Activity Log</h1>
                <div class="header-actions">
                    <button onclick="clearActivityLog()" class="action-btn danger-btn">
                        <i class="fas fa-trash"></i> Clear Log
                    </button>
                    <button onclick="exportActivityLog()" class="action-btn">
                        <i class="fas fa-download"></i> Export Log
                    </button>
                </div>
            </div>
            <div class="activity-filters">
                <select id="activityType" onchange="filterActivityLog()">
                    <option value="all">All Activities</option>
                    <option value="login">Login Events</option>
                    <option value="settings">Settings Changes</option>
                    <option value="messages">Message Actions</option>
                    <option value="data">Data Management</option>
                </select>
                <input type="date" id="activityDate" onchange="filterActivityLog()">
            </div>
            <div id="activityLog" class="activity-list"></div>
        </div>

        <!-- Reports Section -->
        <div id="reportsSection" class="dashboard-section">
            <div class="header">
                <h1><i class="fas fa-file-alt"></i> Reports</h1>
            </div>
            <div class="reports-grid">
                <div class="report-card">
                    <h3>Message Analytics</h3>
                    <div class="report-actions">
                        <button onclick="generateReport('messages')" class="action-btn">
                            <i class="fas fa-file-export"></i> Generate Report
                        </button>
                    </div>
                </div>
                <div class="report-card">
                    <h3>Visitor Statistics</h3>
                    <div class="report-actions">
                        <button onclick="generateReport('visitors')" class="action-btn">
                            <i class="fas fa-file-export"></i> Generate Report
                        </button>
                    </div>
                </div>
                <div class="report-card">
                    <h3>Performance Metrics</h3>
                    <div class="report-actions">
                        <button onclick="generateReport('performance')" class="action-btn">
                            <i class="fas fa-file-export"></i> Generate Report
                        </button>
                    </div>
                </div>
                <div class="report-card">
                    <h3>Custom Report</h3>
                    <div class="report-form">
                        <div class="form-group">
                            <label>Date Range</label>
                            <input type="date" id="reportStartDate">
                            <input type="date" id="reportEndDate">
                        </div>
                        <div class="form-group">
                            <label>Metrics</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" value="messages"> Messages</label>
                                <label><input type="checkbox" value="visitors"> Visitors</label>
                                <label><input type="checkbox" value="performance"> Performance</label>
                            </div>
                        </div>
                        <button onclick="generateCustomReport()" class="action-btn">
                            <i class="fas fa-file-export"></i> Generate Custom Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="notification" class="notification"></div>

    <!-- Add Chart.js for analytics -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js"></script>
    <script src="admin.js"></script>
</body>
</html>
