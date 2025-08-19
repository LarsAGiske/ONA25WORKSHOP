# ONA25 Workshop: NOLA City Hall Monitor - Troubleshooting Guide

## Project Overview

This document provides solutions to common issues participants may encounter while building their city hall monitoring tool during the ONA25 workshop.

**Working Reference Implementation**: The files in this directory contain a fully functional NOLA City Hall Monitor that demonstrates all the concepts taught in the workshop.

## Common Issues & Solutions

### 1. **"My tool shows data instantly instead of fetching from the web"**

**Problem**: Tool displays cached data from localStorage instead of making real web requests.

**Solution**: 
```javascript
// In your monitor initialization, don't auto-display cached data
// Remove or comment out lines like:
// if (this.currentNews.length > 0) {
//     this.displayNews(this.currentNews);
// }

// Instead, require manual "Check for Updates" to fetch fresh data
console.log('Loaded cached data but not displaying - click "Check for Updates" for fresh data');
```

**Reference**: See `monitor.js` lines 695-700 in our working implementation.

---

### 2. **"I'm getting CORS errors when trying to fetch news data"**

**Problem**: Browser blocks requests to external sites due to CORS policy.

**Solution**: Use multiple CORS proxy fallbacks:
```javascript
async fetchNewsData() {
    const proxies = [
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/',
        'https://api.codetabs.com/v1/proxy?quest='
    ];
    
    const targetUrl = 'https://nola.gov/next/news/';
    
    for (let i = 0; i < proxies.length; i++) {
        try {
            const proxyUrl = proxies[i] + encodeURIComponent(targetUrl);
            const response = await fetch(proxyUrl);
            
            if (response.ok) {
                return await response.text();
            }
        } catch (error) {
            console.log(`Proxy ${i + 1} failed, trying next...`);
        }
    }
    throw new Error('All proxies failed');
}
```

**Reference**: See `monitor.js` lines 304-348 for complete implementation.

---

### 3. **"My links point to localhost instead of the real website"**

**Problem**: HTML parsing creates URLs relative to your local server.

**Solution**: Fix URLs during parsing:
```javascript
// Fix localhost URLs to use correct domain
if (url && url.includes('localhost')) {
    url = url.replace(/https?:\/\/localhost(:\d+)?/, 'https://nola.gov');
} else if (url && url.startsWith('/')) {
    url = 'https://nola.gov' + url;
}
```

**Reference**: See `monitor.js` lines 342-352 for complete URL fixing logic.

---

### 4. **"My Clear History button doesn't work"**

**Problem**: Event listeners not properly attached or JavaScript errors.

**Solution**: Add debugging and proper error handling:
```javascript
setupEventListeners() {
    const clearBtn = document.getElementById('clearHistoryBtn');
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            console.log('Clear button clicked');
            this.clearHistory();
        });
    } else {
        console.error('Clear button not found!');
    }
}
```

**Reference**: See `monitor.js` lines 25-74 for complete event listener setup.

---

### 5. **"Browser notifications aren't working"**

**Problem**: Notification permission not requested or granted.

**Solution**: Request permission on app initialization:
```javascript
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

// Call this in your init() method
init() {
    // ... other initialization
    this.requestNotificationPermission();
}
```

**Reference**: See `monitor.js` lines 95-106 for complete notification setup.

---

### 6. **"Auto-checking isn't working"**

**Problem**: setInterval not properly configured or page needs to stay open.

**Solution**: Implement proper auto-check with state management:
```javascript
startAutoCheck() {
    this.autoCheckEnabled = true;
    const intervalMs = this.checkIntervalMinutes * 60 * 1000;
    
    this.autoCheckInterval = setInterval(() => {
        this.checkForUpdates(true); // Silent check
    }, intervalMs);
    
    // Save state to localStorage
    localStorage.setItem('monitor_autocheck', JSON.stringify({
        enabled: true,
        interval: this.checkIntervalMinutes
    }));
}
```

**Reference**: See `monitor.js` lines 190-202 for complete auto-check implementation.

---

## Quick Debugging Commands

### Clear All Data Manually
```javascript
// Paste in browser console to reset everything
localStorage.clear();
location.reload();
```

### Test URL Fixing
```javascript
// Test URL replacement logic
function testUrlFix(url) {
    if (url && url.includes('localhost')) {
        return url.replace(/https?:\/\/localhost(:\d+)?/, 'https://nola.gov');
    }
    return url;
}

console.log(testUrlFix('http://localhost:8000/next/news/'));
// Should output: https://nola.gov/next/news/
```

### Check Event Listeners
```javascript
// Verify buttons exist and have listeners
console.log('Check button:', !!document.getElementById('checkNowBtn'));
console.log('Clear button:', !!document.getElementById('clearHistoryBtn'));
console.log('Auto button:', !!document.getElementById('autoCheckBtn'));
```

## Architecture Overview

### File Structure
```
workshop/
├── index.html          # Main interface
├── style.css           # Responsive styling
├── monitor.js          # Core monitoring logic
└── README.md           # Documentation
```

### Key Classes and Methods
```javascript
class NolaNewsMonitor {
    // Core functionality
    async fetchRealNewsData()    # Fetches fresh data from web
    parseNewsFromHTML(html)      # Extracts news items from HTML
    detectChanges()              # Compares current vs previous data
    
    // User interface
    displayNews(newsItems)       # Shows news in UI
    displayChanges(changes)      # Shows detected changes
    sendNotifications(changes)   # Browser notifications
    
    // Automation
    startAutoCheck()             # Enables periodic checking
    stopAutoCheck()              # Disables periodic checking
    
    // Data management
    saveToStorage()              # Persists data to localStorage
    loadFromStorage()            # Loads data from localStorage
    clearHistory()               # Resets all data
}
```

## Workshop Success Checklist

By the end of the workshop, participants should have:

- [ ] **Working news monitor** that fetches real data from their city's website
- [ ] **Change detection** that identifies new items between checks
- [ ] **Keyword filtering** that highlights relevant content
- [ ] **Browser notifications** for new items
- [ ] **Auto-checking** that runs in the background
- [ ] **Proper URL handling** that links to original articles
- [ ] **Data persistence** using localStorage
- [ ] **Error handling** for network issues

## Production Deployment Tips

### For Real Newsroom Use

1. **Backend Proxy**: Replace CORS proxies with your own backend service
2. **Database Storage**: Use proper database instead of localStorage
3. **Email Alerts**: Add email notifications via services like SendGrid
4. **Webhook Integration**: Connect to Slack/Teams for team alerts
5. **Multiple Sources**: Monitor multiple city pages simultaneously
6. **Advanced NLP**: Use AI for better content analysis and scoring

### Security Considerations

- Never hardcode API keys in frontend code
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting for API calls
- Regular security audits of dependencies

## Contact & Support

During the workshop, if you encounter issues not covered here:

1. **Check the console** (F12) for error messages
2. **Compare with working reference** in this directory
3. **Ask for help** - that's what we're here for!

Remember: The goal is learning, not perfection. Every bug is a learning opportunity! 🚀

---

*This troubleshooting guide is based on the working NOLA City Hall Monitor implementation created during MVP development and testing.*
