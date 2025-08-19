class NolaNewsMonitor {
    constructor() {
        this.apiUrl = 'https://nola.gov/next/news/';
        this.keywords = ['budget', 'police', 'housing', 'development', 'mayor', 'council'];
        this.activeKeywords = new Set(this.keywords);
        this.lastCheck = null;
        this.previousNews = [];
        this.currentNews = [];
        this.autoCheckInterval = null;
        this.autoCheckEnabled = false;
        this.checkIntervalMinutes = 15; // Default: check every 15 minutes
        this.notificationsEnabled = false;
        
        this.init();
    }

    init() {
        console.log('=== NOLA NEWS MONITOR INITIALIZATION ===');
        console.log('Version: 1.0.0');
        console.log('Timestamp:', new Date().toISOString());
        console.log('Browser:', navigator.userAgent);
        console.log('Local Storage Available:', typeof(Storage) !== 'undefined');
        console.log('Notification API Available:', 'Notification' in window);
        
        this.setupEventListeners();
        this.loadFromStorage();
        
        console.log('Monitor initialized successfully');
        console.log('Current keywords:', Array.from(this.activeKeywords));
        console.log('Auto-check enabled:', this.autoCheckEnabled);
        console.log('=== INITIALIZATION COMPLETE ===');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        const checkBtn = document.getElementById('checkNowBtn');
        const clearBtn = document.getElementById('clearHistoryBtn');
        const autoBtn = document.getElementById('autoCheckBtn');
        const intervalSelect = document.getElementById('intervalSelect');
        
        console.log('Found elements:', {
            checkBtn: !!checkBtn,
            clearBtn: !!clearBtn,
            autoBtn: !!autoBtn,
            intervalSelect: !!intervalSelect
        });
        
        if (checkBtn) {
            checkBtn.addEventListener('click', () => {
                console.log('Check button clicked');
                this.checkForUpdates();
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                console.log('Clear button clicked');
                this.clearHistory();
            });
        }
        
        if (autoBtn) {
            autoBtn.addEventListener('click', () => {
                console.log('Auto check button clicked');
                this.toggleAutoCheck();
            });
        }
        
        if (intervalSelect) {
            intervalSelect.addEventListener('change', (e) => {
                console.log('Interval changed to:', e.target.value);
                this.setCheckInterval(e.target.value);
            });
        }
        
        // Setup filter tag toggles
        const filterTags = document.querySelectorAll('.filter-tag');
        console.log('Found filter tags:', filterTags.length);
        filterTags.forEach(tag => {
            tag.addEventListener('click', () => this.toggleKeyword(tag));
        });
        
        console.log('Event listeners setup complete');
    }

    toggleKeyword(tag) {
        const keyword = tag.dataset.keyword;
        if (this.activeKeywords.has(keyword)) {
            this.activeKeywords.delete(keyword);
            tag.classList.remove('active');
        } else {
            this.activeKeywords.add(keyword);
            tag.classList.add('active');
        }
        
        // Re-filter current results if they exist
        if (this.currentNews.length > 0) {
            this.displayNews(this.currentNews);
        }
    }

    async checkForUpdates() {
        console.log('=== CHECK FOR UPDATES START ===');
        console.log('Timestamp:', new Date().toISOString());
        console.log('Current news count:', this.currentNews.length);
        console.log('Previous news count:', this.previousNews.length);
        console.log('Starting fresh data fetch from nola.gov...');
        
        const btn = document.getElementById('checkNowBtn');
        const status = document.getElementById('status');
        
        btn.disabled = true;
        status.className = 'status loading';
        status.innerHTML = '<div class="loading-spinner"></div>Fetching fresh data from nola.gov...';

        try {
            // Always fetch fresh data from NOLA.gov - never use cache for manual checks
            const freshData = await this.fetchRealNewsData();
            console.log('=== FRESH DATA RECEIVED ===');
            console.log('Items count:', freshData.length);
            console.log('Sample items:', freshData.slice(0, 2));
            
            // Store previous data for comparison
            console.log('Storing previous data for comparison...');
            this.previousNews = [...this.currentNews];
            this.currentNews = freshData;
            
            // Detect changes
            console.log('Detecting changes...');
            const changes = this.detectChanges();
            console.log('=== CHANGES DETECTED ===');
            console.log('Total changes:', changes.length);
            console.log('New items:', changes.filter(c => c.type === 'NEW').length);
            console.log('Removed items:', changes.filter(c => c.type === 'REMOVED').length);
            if (changes.length > 0) {
                console.log('Change details:', changes);
            }
            
            this.displayNews(freshData);
            this.displayChanges(changes);
            this.saveToStorage();
            this.updateLastCheckedDisplay();
            this.addToHistory(freshData.length, changes.length);
            
            // Send notifications for new items
            if (changes.length > 0) {
                this.sendNotifications(changes);
            }
            
            this.updateStatus(`Found ${freshData.length} news items, ${changes.length} changes detected`, true);
            console.log('=== CHECK FOR UPDATES SUCCESS ===');
            
        } catch (error) {
            console.log('=== CHECK FOR UPDATES FAILED ===');
            console.error('Error checking for updates:', error);
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            this.updateStatus('Error: ' + error.message, false);
            console.log('=== CHECK FOR UPDATES END (FAILED) ===');
        } finally {
            const btn = document.getElementById('checkNowBtn');
            btn.disabled = false;
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                this.notificationsEnabled = permission === 'granted';
            } else {
                this.notificationsEnabled = Notification.permission === 'granted';
            }
        }
    }

    sendNotifications(changes) {
        if (!this.notificationsEnabled || changes.length === 0) return;

        const newItems = changes.filter(change => change.type === 'NEW');
        if (newItems.length === 0) return;

        // Group notifications to avoid spam
        if (newItems.length === 1) {
            const item = newItems[0].item;
            new Notification('🏛️ New NOLA News Item', {
                body: `${item.title}\nFrom: ${item.source}`,
                icon: '/favicon.ico',
                tag: 'nola-news-single'
            });
        } else {
            new Notification('🏛️ Multiple New NOLA News Items', {
                body: `${newItems.length} new items detected. Check the monitor for details.`,
                icon: '/favicon.ico',
                tag: 'nola-news-multiple'
            });
        }

        // Play notification sound (optional)
        this.playNotificationSound();
    }

    playNotificationSound() {
        // Create a subtle notification sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    toggleAutoCheck() {
        const btn = document.getElementById('autoCheckBtn');
        const status = document.getElementById('autoStatus');
        
        if (this.autoCheckEnabled) {
            this.stopAutoCheck();
            btn.textContent = '▶️ Start Auto Check';
            btn.className = 'primary-btn';
            status.textContent = 'Auto-check disabled';
            status.className = 'auto-status';
        } else {
            this.startAutoCheck();
            btn.textContent = '⏸️ Stop Auto Check';
            btn.className = 'secondary-btn';
            status.textContent = `Auto-checking every ${this.checkIntervalMinutes} minutes`;
            status.className = 'auto-status active';
        }
    }

    startAutoCheck() {
        console.log('=== START AUTO-CHECK ===');
        console.log('Current interval minutes:', this.checkIntervalMinutes);
        
        if (this.autoCheckInterval) {
            console.log('Clearing existing auto-check interval');
            clearInterval(this.autoCheckInterval);
        }
        
        const intervalMs = this.checkIntervalMinutes * 60 * 1000;
        console.log(`Setting up auto-check every ${this.checkIntervalMinutes} minutes (${intervalMs}ms)`);
        
        this.autoCheckInterval = setInterval(() => {
            console.log('=== AUTO-CHECK TRIGGERED ===');
            console.log('Timestamp:', new Date().toISOString());
            this.checkForUpdates();
        }, intervalMs);
        
        console.log('Auto-check started successfully');
        console.log('Interval ID:', this.autoCheckInterval);
        
        // Save auto-check state
        localStorage.setItem('nola_monitor_autocheck', JSON.stringify({
            enabled: true,
            interval: this.checkIntervalMinutes
        }));
    }

    stopAutoCheck() {
        console.log('=== STOP AUTO-CHECK ===');
        if (this.autoCheckInterval) {
            console.log('Clearing interval ID:', this.autoCheckInterval);
            clearInterval(this.autoCheckInterval);
            this.autoCheckInterval = null;
            console.log('Auto-check stopped successfully');
        } else {
            console.log('No auto-check interval to stop');
        }
        
        // Save auto-check state
        localStorage.setItem('nola_monitor_autocheck', JSON.stringify({
            enabled: false,
            interval: this.checkIntervalMinutes
        }));
    }

    setCheckInterval(minutes) {
        this.checkIntervalMinutes = parseInt(minutes);
        
        // Restart auto-check with new interval if it's running
        if (this.autoCheckEnabled) {
            this.stopAutoCheck();
            this.startAutoCheck();
        }
        
        // Update status display
        const status = document.getElementById('autoStatus');
        if (this.autoCheckEnabled) {
            status.textContent = `Auto-checking every ${this.checkIntervalMinutes} minutes`;
        }
    }

    async fetchRealNewsData() {
        console.log('=== FETCH REAL NEWS DATA START ===');
        console.log('Timestamp:', new Date().toISOString());
        
        try {
            // Try multiple CORS proxies in order of preference
            const proxies = [
                'https://corsproxy.io/?',
                'https://cors-anywhere.herokuapp.com/',
                'https://api.codetabs.com/v1/proxy?quest='
            ];
            
            const targetUrl = 'https://nola.gov/next/news/';
            console.log('Target URL:', targetUrl);
            console.log('Available proxies:', proxies.length);
            
            for (let i = 0; i < proxies.length; i++) {
                try {
                    const proxyUrl = proxies[i] + encodeURIComponent(targetUrl);
                    console.log(`=== PROXY ATTEMPT ${i + 1}/${proxies.length} ===`);
                    console.log('Proxy base:', proxies[i]);
                    console.log('Full proxy URL:', proxyUrl);
                    console.log('Making fetch request...');
                    
                    const response = await fetch(proxyUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    
                    console.log('Response status:', response.status);
                    console.log('Response ok:', response.ok);
                    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
                    
                    if (!response.ok) {
                        console.log(`Proxy ${i + 1} failed with HTTP ${response.status}`);
                        throw new Error(`HTTP ${response.status}`);
                    }
                    
                    console.log('Fetching response text...');
                    const html = await response.text();
                    console.log(`Successfully fetched from proxy ${i + 1}`);
                    console.log('HTML length:', html.length);
                    console.log('HTML preview:', html.substring(0, 200) + '...');
                    
                    const newsItems = this.parseNewsFromHTML(html);
                    console.log('=== FETCH SUCCESS ===');
                    return newsItems;
                    
                } catch (proxyError) {
                    console.log(`=== PROXY ${i + 1} FAILED ===`);
                    console.log('Error type:', proxyError.constructor.name);
                    console.log('Error message:', proxyError.message);
                    console.log('Error stack:', proxyError.stack);
                    
                    if (i === proxies.length - 1) {
                        console.log('=== ALL PROXIES FAILED ===');
                        throw proxyError;
                    } else {
                        console.log(`Trying next proxy (${i + 2}/${proxies.length})...`);
                    }
                }
            }
        } catch (error) {
            console.log('=== FETCH REAL NEWS DATA FAILED ===');
            console.error('Final error:', error);
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.log('=== FETCH END (FAILED) ===');
            throw new Error('Unable to fetch news data. Please check your internet connection.');
        }
    }

    parseNewsFromHTML(html) {
        // Create a temporary DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const newsItems = [];
        
        // Look for news article containers - based on the structure we observed
        const articleElements = doc.querySelectorAll('h3 a[href*="/"], h3 a[href*="nopdnews.com"]');
        
        articleElements.forEach((linkElement, index) => {
            const title = linkElement.textContent.trim();
            let url = linkElement.getAttribute('href') || linkElement.href;
            
            // Debug logging
            console.log('=== URL DEBUG ===');
            console.log('Title:', title);
            console.log('Raw href attribute:', linkElement.getAttribute('href'));
            console.log('Element.href property:', linkElement.href);
            console.log('Selected URL:', url);
            console.log('URL includes localhost?', url && url.includes('localhost'));
            
            // More aggressive localhost replacement
            if (url && url.includes('localhost')) {
                console.log('BEFORE replacement:', url);
                // Try multiple replacement patterns
                url = url.replace(/https?:\/\/localhost(:\d+)?/g, 'https://nola.gov');
                url = url.replace(/localhost(:\d+)?/g, 'nola.gov');
                console.log('AFTER replacement:', url);
            } else if (url && url.startsWith('/')) {
                // Fix relative URLs to use nola.gov domain
                url = 'https://nola.gov' + url;
                console.log('Fixed relative URL to:', url);
            } else if (url && !url.startsWith('http') && !url.includes('nopdnews.com')) {
                // Handle other malformed URLs (but leave nopdnews.com alone)
                url = 'https://nola.gov' + (url.startsWith('/') ? '' : '/') + url;
                console.log('Fixed malformed URL to:', url);
            }
            
            console.log('FINAL URL:', url);
            console.log('=================');
            
            // Find the parent container to get additional info
            let container = linkElement.closest('div') || linkElement.parentElement;
            let excerpt = '';
            let date = '';
            let source = '';
            
            // Look for date and source info in the container
            const textContent = container.textContent || '';
            
            // Extract date (look for patterns like "August 7, 2025")
            const dateMatch = textContent.match(/([A-Z][a-z]+ \d{1,2}, \d{4})/);
            if (dateMatch) {
                date = dateMatch[1];
            }
            
            // Extract source
            if (textContent.includes('From NOPD News')) {
                source = 'NOPD News';
            } else if (textContent.includes('From City of New Orleans')) {
                source = 'City of New Orleans';
            } else {
                source = 'City of New Orleans'; // Default
            }
            
            // Get excerpt - look for text after the title but before date/source
            const lines = textContent.split('\n').map(line => line.trim()).filter(line => line);
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line === title) {
                    // Look for the next meaningful line that's not date/source
                    for (let j = i + 1; j < lines.length; j++) {
                        const nextLine = lines[j];
                        if (nextLine && 
                            !nextLine.includes('From ') && 
                            !nextLine.match(/[A-Z][a-z]+ \d{1,2}, \d{4}/) &&
                            nextLine.length > 20) {
                            excerpt = nextLine;
                            break;
                        }
                    }
                    break;
                }
            }
            
            // Create unique ID from URL or title
            const id = url ? url.split('/').pop() || `item-${index}` : `item-${index}`;
            
            // Estimate timestamp from date
            let timestamp = Date.now();
            if (date) {
                try {
                    timestamp = new Date(date).getTime();
                } catch (e) {
                    timestamp = Date.now() - (index * 3600000); // Fallback: space items by hours
                }
            }
            
            if (title && title.length > 3) { // Filter out empty or very short titles
                newsItems.push({
                    id,
                    title,
                    url: url || '#',
                    date: date || 'Recent',
                    source,
                    excerpt: excerpt || 'No description available',
                    timestamp
                });
            }
        });
        
        return newsItems;
    }

    detectChanges() {
        const changes = [];
        
        // Find new items
        this.currentNews.forEach(current => {
            const existsInPrevious = this.previousNews.some(prev => prev.id === current.id);
            if (!existsInPrevious) {
                changes.push({
                    type: 'NEW',
                    item: current,
                    description: `New article: "${current.title}"`
                });
            }
        });

        // Find removed items
        this.previousNews.forEach(previous => {
            const existsInCurrent = this.currentNews.some(curr => curr.id === previous.id);
            if (!existsInCurrent) {
                changes.push({
                    type: 'REMOVED',
                    item: previous,
                    description: `Removed article: "${previous.title}"`
                });
            }
        });

        return changes;
    }

    displayNews(newsItems) {
        const container = document.getElementById('newsResults');
        
        if (newsItems.length === 0) {
            container.innerHTML = '<p class="placeholder">No news items found</p>';
            return;
        }

        const filteredItems = newsItems.filter(item => this.isRelevant(item));
        
        container.innerHTML = filteredItems.map(item => {
            const keywords = this.findKeywords(item);
            const newsworthiness = this.calculateNewsworthiness(item, keywords);
            
            return `
                <div class="news-item ${item.isNew ? 'new' : ''} ${keywords.length > 0 ? 'highlighted' : ''}">
                    <div class="news-title">
                        <a href="${item.url}" target="_blank">${item.title}</a>
                        ${item.isNew ? '<span style="color: #27ae60; font-weight: bold;"> [NEW]</span>' : ''}
                    </div>
                    <div class="news-meta">
                        ${item.date} | From ${item.source}
                    </div>
                    <div class="news-excerpt">
                        ${item.excerpt}
                    </div>
                    ${keywords.length > 0 ? `
                        <div class="news-keywords">
                            ${keywords.map(kw => `<span class="keyword-highlight">${kw}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="newsworthiness ${newsworthiness.level}">
                        Newsworthiness: ${newsworthiness.score}/5 (${newsworthiness.level})
                    </div>
                </div>
            `;
        }).join('');
    }

    displayChanges(changes) {
        const container = document.getElementById('changesResults');
        
        if (changes.length === 0) {
            container.innerHTML = '<p class="placeholder">No changes detected</p>';
            return;
        }

        container.innerHTML = changes.map(change => `
            <div class="change-item">
                <div class="change-type">${change.type}</div>
                <div>${change.description}</div>
                <div class="news-meta">${change.item.date} | From ${change.item.source}</div>
            </div>
        `).join('');
    }

    findKeywords(item) {
        const text = `${item.title} ${item.excerpt}`.toLowerCase();
        return Array.from(this.activeKeywords).filter(keyword => 
            text.includes(keyword.toLowerCase())
        );
    }

    calculateNewsworthiness(item, keywords) {
        let score = 1; // Base score
        
        // Keyword relevance
        score += keywords.length * 1.5;
        
        // Source importance
        if (item.source.includes('Mayor')) score += 1;
        if (item.source.includes('City of New Orleans')) score += 0.5;
        
        // Title indicators
        const title = item.title.toLowerCase();
        if (title.includes('breaking') || title.includes('emergency')) score += 2;
        if (title.includes('budget') || title.includes('council')) score += 1;
        
        // Recency (newer = more newsworthy)
        const hoursOld = (Date.now() - item.timestamp) / (1000 * 60 * 60);
        if (hoursOld < 6) score += 1;
        else if (hoursOld < 24) score += 0.5;
        
        score = Math.min(5, Math.max(1, Math.round(score)));
        
        const level = score >= 4 ? 'high' : score >= 3 ? 'medium' : 'low';
        
        return { score, level };
    }

    isRelevant(item) {
        // Show all items, but highlight those with keywords
        return true;
    }

    updateLastCheckedDisplay() {
        const element = document.getElementById('lastChecked');
        if (this.lastCheck) {
            element.textContent = `Last checked: ${new Date(this.lastCheck).toLocaleString()}`;
        } else {
            element.textContent = 'Never checked';
        }
    }

    addToHistory(newsCount, changesCount) {
        const history = this.getHistory();
        history.unshift({
            timestamp: Date.now(),
            newsCount,
            changesCount
        });
        
        // Keep only last 10 checks
        if (history.length > 10) {
            history.splice(10);
        }
        
        localStorage.setItem('nola_monitor_history', JSON.stringify(history));
        this.displayHistory();
    }

    displayHistory() {
        const container = document.getElementById('historyResults');
        const history = this.getHistory();
        
        if (history.length === 0) {
            container.innerHTML = '<p class="placeholder">No history available</p>';
            return;
        }

        container.innerHTML = history.map(entry => `
            <div class="history-item">
                <div class="history-timestamp">
                    ${new Date(entry.timestamp).toLocaleString()}
                </div>
                <div class="history-summary">
                    Found ${entry.newsCount} news items, ${entry.changesCount} changes detected
                </div>
            </div>
        `).join('');
    }

    getHistory() {
        try {
            return JSON.parse(localStorage.getItem('nola_monitor_history') || '[]');
        } catch {
            return [];
        }
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all history and data?')) {
            console.log('Clearing all data...');
            
            // Stop auto-check if running
            if (this.autoCheckEnabled) {
                this.stopAutoCheck();
            }
            
            // Clear all localStorage items
            localStorage.removeItem('nola_monitor_history');
            localStorage.removeItem('nola_monitor_data');
            localStorage.removeItem('nola_monitor_autocheck');
            
            // Reset all instance variables
            this.previousNews = [];
            this.currentNews = [];
            this.lastCheck = null;
            this.autoCheckEnabled = false;
            
            // Clear all UI elements
            document.getElementById('historyResults').innerHTML = '<p class="placeholder">No history available</p>';
            document.getElementById('newsResults').innerHTML = '<p class="placeholder">Click "Check for Updates" to start monitoring</p>';
            document.getElementById('changesResults').innerHTML = '<p class="placeholder">No changes detected yet</p>';
            this.updateLastCheckedDisplay();
            
            // Reset auto-check UI
            const autoBtn = document.getElementById('autoCheckBtn');
            const autoStatus = document.getElementById('autoStatus');
            if (autoBtn && autoStatus) {
                autoBtn.textContent = '▶️ Start Auto Check';
                autoBtn.className = 'primary-btn';
                autoStatus.textContent = 'Auto-check disabled';
                autoStatus.className = 'auto-status';
            }
            
            document.getElementById('status').className = 'status';
            document.getElementById('status').textContent = 'All data cleared - ready to check for updates';
            
            console.log('Data clearing complete');
        }
    }

    saveToStorage() {
        const data = {
            lastCheck: Date.now(),
            currentNews: this.currentNews,
            previousNews: this.previousNews
        };
        
        localStorage.setItem('nola_monitor_data', JSON.stringify(data));
        this.lastCheck = data.lastCheck;
    }

    loadFromStorage() {
        try {
            const data = JSON.parse(localStorage.getItem('nola_monitor_data') || '{}');
            this.lastCheck = data.lastCheck || null;
            this.currentNews = data.currentNews || [];
            this.previousNews = data.previousNews || [];
            
            // Load auto-check settings
            const autoCheckData = JSON.parse(localStorage.getItem('nola_monitor_autocheck') || '{}');
            if (autoCheckData.enabled) {
                this.checkIntervalMinutes = autoCheckData.interval || 15;
                document.getElementById('intervalSelect').value = this.checkIntervalMinutes;
                this.startAutoCheck();
                
                // Update UI
                const btn = document.getElementById('autoCheckBtn');
                const status = document.getElementById('autoStatus');
                btn.textContent = '⏸️ Stop Auto Check';
                btn.className = 'secondary-btn';
                status.textContent = `Auto-checking every ${this.checkIntervalMinutes} minutes`;
                status.className = 'auto-status active';
            }
            
            // Don't auto-display cached news on startup - require manual check
            // This ensures "Check for Updates" always fetches fresh data
            console.log('Loaded cached data but not displaying - click "Check for Updates" for fresh data');
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    updateStatus(message, success) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = success ? 'status success' : 'status error';
    }
}

// Initialize the monitor when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing NOLA News Monitor...');
    try {
        const monitor = new NolaNewsMonitor();
        console.log('NOLA News Monitor initialized successfully');
        window.monitor = monitor; // Make it globally accessible for debugging
    } catch (error) {
        console.error('Error initializing NOLA News Monitor:', error);
    }
});
