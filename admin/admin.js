// Visitor Tracking System
class VisitorTracker {
    constructor() {
        this.startTime = new Date();
        this.visitorId = this.generateVisitorId();
        this.pageViews = {};
        this.setupTracking();
        this.getVisitorIP();
    }

    generateVisitorId() {
        return 'visitor_' + Math.random().toString(36).substr(2, 9);
    }

    async getVisitorIP() {
        try {
            // Using multiple IP APIs for better reliability
            const ipApis = [
                'https://api.ipify.org?format=json',
                'https://api64.ipify.org?format=json',
                'https://api.my-ip.io/ip.json',
                'https://api.ip.sb/jsonip',
                'https://api.db-ip.com/v2/free/self'
            ];

            let ipFound = false;
            for (const api of ipApis) {
                if (ipFound) break;
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
                    
                    const response = await fetch(api, { 
                        signal: controller.signal,
                        headers: {
                            'Accept': 'application/json',
                            'User-Agent': navigator.userAgent
                        }
                    });
                    clearTimeout(timeoutId);
                    
                    if (!response.ok) continue;
                    const data = await response.json();
                    this.ipAddress = data.ip || data.ipAddress || data.address;
                    if (this.ipAddress) {
                        ipFound = true;
                        this.saveVisitData();
                    }
                } catch (e) {
                    console.warn(`Failed to fetch IP from ${api}:`, e.message);
                    continue;
                }
            }
            
            if (!ipFound) {
                throw new Error('All IP APIs failed');
            }
        } catch (error) {
            console.error('Error getting IP:', error);
            this.ipAddress = 'Unknown';
            // Still save visit data even if IP is unknown
            this.saveVisitData();
        }
    }

    getDeviceInfo() {
        const ua = navigator.userAgent.toLowerCase();
        const browser = this.getBrowserInfo(ua);
        const os = this.getOSInfo(ua);
        const device = this.getDeviceType(ua);
        
        return {
            browser: browser,
            os: os,
            device: device,
            isMobile: /mobile|tablet|android|iphone|ipad|ipod/i.test(ua),
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: window.screen.colorDepth,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookiesEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            connection: this.getConnectionInfo(),
            battery: this.getBatteryInfo(),
            plugins: this.getPluginsInfo(),
            touchSupport: 'ontouchstart' in window,
            orientation: screen.orientation ? screen.orientation.type : 'unknown'
        };
    }

    getBrowserInfo(ua) {
        const browsers = {
            chrome: /chrome/i,
            safari: /safari/i,
            firefox: /firefox/i,
            opera: /opera/i,
            edge: /edge/i,
            ie: /msie|trident/i
        };

        for (let browser in browsers) {
            if (browsers[browser].test(ua)) {
                return browser;
            }
        }
        return 'unknown';
    }

    getOSInfo(ua) {
        const os = {
            windows: /windows/i,
            mac: /mac/i,
            linux: /linux/i,
            android: /android/i,
            ios: /iphone|ipad|ipod/i
        };

        for (let key in os) {
            if (os[key].test(ua)) {
                return key;
            }
        }
        return 'unknown';
    }

    getDeviceType(ua) {
        // Check for tablets first
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
            return 'tablet';
        }
        // Check for mobile devices
        if (
            /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|webOS/i.test(ua) ||
            (window.innerWidth <= 800 && window.innerHeight <= 600)
        ) {
            return 'mobile';
        }
        return 'desktop';
    }

    getConnectionInfo() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            return {
                type: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }
        return null;
    }

    async getBatteryInfo() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                return {
                    level: battery.level,
                    charging: battery.charging
                };
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    getPluginsInfo() {
        const plugins = [];
        for (let i = 0; i < navigator.plugins.length; i++) {
            plugins.push(navigator.plugins[i].name);
        }
        return plugins;
    }

    setupTracking() {
        // Track page views
        this.trackPageView();

        // Track time spent
        this.trackTimeSpent();

        // Track mouse movement and clicks
        this.trackUserInteraction();

        // Track before user leaves
        window.addEventListener('beforeunload', () => {
            this.saveVisitData();
        });
    }

    trackPageView() {
        const page = window.location.pathname;
        if (!this.pageViews[page]) {
            this.pageViews[page] = {
                count: 0,
                firstVisit: new Date().toISOString(),
                lastVisit: null
            };
        }
        this.pageViews[page].count++;
        this.pageViews[page].lastVisit = new Date().toISOString();
        this.saveVisitData();
    }

    trackTimeSpent() {
        setInterval(() => {
            this.saveVisitData();
        }, 10000); // Update every 10 seconds
    }

    trackUserInteraction() {
        let lastActivity = new Date();
        this.interactions = {
            clicks: 0,
            mouseMoves: 0,
            keystrokes: 0,
            scrolls: 0,
            lastActivity: lastActivity.toISOString()
        };

        document.addEventListener('click', () => {
            this.interactions.clicks++;
            this.updateLastActivity();
        });

        document.addEventListener('mousemove', () => {
            this.interactions.mouseMoves++;
            this.updateLastActivity();
        });

        document.addEventListener('keypress', () => {
            this.interactions.keystrokes++;
            this.updateLastActivity();
        });

        document.addEventListener('scroll', () => {
            this.interactions.scrolls++;
            this.updateLastActivity();
        });
    }

    updateLastActivity() {
        this.interactions.lastActivity = new Date().toISOString();
        this.saveVisitData();
    }

    getTimeSpent() {
        return Math.floor((new Date() - this.startTime) / 1000); // Time in seconds
    }

    async saveVisitData() {
        const deviceInfo = this.getDeviceInfo();
        const visitData = {
            visitorId: this.visitorId,
            ipAddress: this.ipAddress,
            startTime: this.startTime.toISOString(),
            timeSpent: this.getTimeSpent(),
            pageViews: this.pageViews,
            lastActive: new Date().toISOString(),
            referrer: document.referrer,
            entryPage: window.location.pathname,
            deviceInfo: deviceInfo,
            interactions: this.interactions,
            location: await this.getLocationInfo(),
            performance: this.getPerformanceMetrics()
        };

        // Get existing visitors data
        let visitors = JSON.parse(localStorage.getItem('visitorData')) || [];
        
        // Update or add new visitor data
        const existingVisitorIndex = visitors.findIndex(v => v.visitorId === this.visitorId);
        if (existingVisitorIndex !== -1) {
            visitors[existingVisitorIndex] = visitData;
        } else {
            visitors.push(visitData);
        }

        // Save back to localStorage
        localStorage.setItem('visitorData', JSON.stringify(visitors));
    }

    async getLocationInfo() {
        if (!this.ipAddress || this.ipAddress === 'Unknown') {
            return {
                country: 'Unknown',
                region: 'Unknown',
                city: 'Unknown',
                latitude: null,
                longitude: null,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
        }

        try {
            // Try multiple geolocation APIs with fallback
            const geoApis = [
                `https://ipapi.co/${this.ipAddress}/json/`,
                `https://ipwho.is/${this.ipAddress}`,
                `https://ipinfo.io/${this.ipAddress}/json`
            ];

            for (const api of geoApis) {
                try {
                    const response = await fetch(api);
                    if (!response.ok) continue;
                    const data = await response.json();
                    
                    // Handle different API response formats
                    return {
                        country: data.country_name || data.country || 'Unknown',
                        region: data.region || data.region_name || 'Unknown',
                        city: data.city || 'Unknown',
                        latitude: data.latitude || data.loc?.split(',')[0] || null,
                        longitude: data.longitude || data.loc?.split(',')[1] || null,
                        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
                    };
                } catch (e) {
                    continue;
                }
            }
            throw new Error('All geolocation APIs failed');
        } catch (error) {
            console.error('Error getting location:', error);
            return {
                country: 'Unknown',
                region: 'Unknown',
                city: 'Unknown',
                latitude: null,
                longitude: null,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
        }
    }

    getPerformanceMetrics() {
        if (window.performance) {
            const timing = window.performance.timing;
            return {
                pageLoadTime: timing.loadEventEnd - timing.navigationStart,
                dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
                serverResponseTime: timing.responseEnd - timing.requestStart,
                domLoadTime: timing.domComplete - timing.domLoading
            };
        }
        return null;
    }
}

// Initialize visitor tracking
const visitorTracker = new VisitorTracker();
