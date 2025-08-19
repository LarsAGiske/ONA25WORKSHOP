# NOLA City Hall Monitor - Technical Documentation

## 📋 Overview

This document provides comprehensive technical details about the NOLA City Hall Monitor MVP, including architecture, tech stack, module explanations, and implementation details.

## 🛠️ Tech Stack

### Frontend Technologies
| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **HTML5** | Latest | Semantic markup, structure | Universal browser support, accessibility features |
| **CSS3** | Latest | Styling, responsive design | Modern layout with Flexbox/Grid, no framework dependencies |
| **JavaScript (ES6+)** | ES2020+ | Application logic, DOM manipulation | Native browser support, no build process required |

### External Services
| Service | Purpose | Fallback Strategy |
|---------|---------|-------------------|
| **corsproxy.io** | Primary CORS proxy | Automatic fallback to secondary proxies |
| **cors-anywhere.herokuapp.com** | Secondary CORS proxy | Fallback to tertiary proxy |
| **api.codetabs.com** | Tertiary CORS proxy | Error handling and user notification |

### Browser APIs Used
- **Fetch API**: HTTP requests to CORS proxies
- **Notification API**: Desktop notifications for new items
- **Web Audio API**: Notification sound generation
- **localStorage API**: Data persistence across sessions
- **DOM Parser API**: HTML parsing for news extraction

## 🏗️ Architecture Overview

### Application Structure
```
┌─────────────────────────────────────┐
│           Browser Environment       │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐ │
│  │        User Interface           │ │
│  │  (index.html + style.css)       │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │    NolaNewsMonitor Class        │ │
│  │      (monitor.js)               │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │   Data Fetching Module      │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │   Change Detection Module   │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │   Notification Module       │ │ │
│  │  └─────────────────────────────┘ │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │   Storage Module            │ │ │
│  │  └─────────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │       Browser Storage           │ │
│  │      (localStorage)             │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│         CORS Proxies                │
├─────────────────────────────────────┤
│  corsproxy.io                       │
│  cors-anywhere.herokuapp.com        │
│  api.codetabs.com                   │
└─────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│         Target Website              │
├─────────────────────────────────────┤
│  https://nola.gov/next/news/        │
└─────────────────────────────────────┘
```

### Data Flow
1. **User Action**: Click "Check for Updates" or auto-check triggers
2. **Proxy Selection**: Try CORS proxies in sequence until success
3. **Data Fetching**: Retrieve HTML from nola.gov via proxy
4. **HTML Parsing**: Extract news items using DOM parsing
5. **URL Fixing**: Convert localhost URLs to proper nola.gov URLs
6. **Change Detection**: Compare with previous data to find new/removed items
7. **UI Update**: Display news items with keyword highlighting
8. **Notifications**: Send browser notifications for new items
9. **Storage**: Persist data and history to localStorage

## 📁 Module Breakdown

### 1. User Interface Module (`index.html` + `style.css`)

#### `index.html` - Structure
```html
<header>                    <!-- App title and description -->
<main>
  <div class="controls">           <!-- Manual check and clear buttons -->
  <div class="automation-controls"> <!-- Auto-check settings -->
  <div class="filters">            <!-- Keyword filter toggles -->
  <div class="results-section">    <!-- Latest news display -->
  <div class="changes-section">    <!-- Detected changes -->
  <div class="history-section">    <!-- Check history log -->
</main>
```

**Key Features:**
- Semantic HTML5 structure for accessibility
- Progressive enhancement approach
- No external dependencies
- Mobile-first responsive design

#### `style.css` - Styling
```css
/* Layout System */
.controls, .automation-row     /* Flexbox for button layouts */
.news-item                     /* Card-based news display */
.filter-tags                   /* Flexible tag system */

/* Visual States */
.status.loading               /* Loading spinner animation */
.news-item.highlighted        /* Keyword-matched items */
.news-item.new               /* Newly detected items */
.auto-status.active          /* Active auto-check indicator */

/* Responsive Design */
@media (max-width: 768px)    /* Mobile adaptations */
```

**Design Principles:**
- Modern CSS Grid and Flexbox layouts
- CSS custom properties for theming
- Smooth transitions and micro-interactions
- Professional newsroom-appropriate styling

### 2. Core Application Module (`monitor.js`)

#### NolaNewsMonitor Class Structure
```javascript
class NolaNewsMonitor {
    // Configuration
    constructor()                    // Initialize settings and state
    init()                          // Setup event listeners and load data
    
    // Data Management
    async fetchRealNewsData()       // Fetch from nola.gov via CORS proxy
    parseNewsFromHTML(html)         // Extract news items from HTML
    detectChanges()                 // Compare current vs previous data
    
    // User Interface
    displayNews(newsItems)          // Render news items in UI
    displayChanges(changes)         // Show detected changes
    updateLastCheckedDisplay()      // Update timestamp display
    
    // Filtering & Scoring
    findKeywords(item)              // Extract relevant keywords
    calculateNewsworthiness(item)   // Score items 1-5 for importance
    isRelevant(item)               // Filter based on active keywords
    
    // Automation
    startAutoCheck()               // Begin periodic checking
    stopAutoCheck()                // Stop periodic checking
    toggleAutoCheck()              // Toggle auto-check state
    
    // Notifications
    sendNotifications(changes)      // Send browser notifications
    playNotificationSound()        // Audio notification cue
    
    // Storage
    saveToStorage()                // Persist to localStorage
    loadFromStorage()              // Load from localStorage
    clearHistory()                 // Reset all data
}
```

#### Key Algorithms

**CORS Proxy Fallback System:**
```javascript
const proxies = [
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.codetabs.com/v1/proxy?quest='
];

for (let i = 0; i < proxies.length; i++) {
    try {
        const response = await fetch(proxyUrl);
        if (response.ok) return await response.text();
    } catch (error) {
        // Try next proxy
    }
}
```

**Change Detection Algorithm:**
```javascript
detectChanges() {
    const changes = [];
    
    // Find new items
    this.currentNews.forEach(current => {
        const existsInPrevious = this.previousNews.some(prev => prev.id === current.id);
        if (!existsInPrevious) {
            changes.push({ type: 'NEW', item: current });
        }
    });
    
    // Find removed items
    this.previousNews.forEach(previous => {
        const existsInCurrent = this.currentNews.some(curr => curr.id === previous.id);
        if (!existsInCurrent) {
            changes.push({ type: 'REMOVED', item: previous });
        }
    });
    
    return changes;
}
```

**Newsworthiness Scoring:**
```javascript
calculateNewsworthiness(item, keywords) {
    let score = 1; // Base score
    
    // Keyword relevance (1.5 points per keyword)
    score += keywords.length * 1.5;
    
    // Source importance
    if (item.source.includes('Mayor')) score += 1;
    if (item.source.includes('City of New Orleans')) score += 0.5;
    
    // Title indicators
    if (item.title.toLowerCase().includes('breaking')) score += 2;
    if (item.title.toLowerCase().includes('emergency')) score += 2;
    
    // Recency bonus
    const hoursOld = (Date.now() - item.timestamp) / (1000 * 60 * 60);
    if (hoursOld < 6) score += 1;
    else if (hoursOld < 24) score += 0.5;
    
    return Math.min(5, Math.max(1, Math.round(score)));
}
```

## 🔧 Configuration & Settings

### Default Configuration
```javascript
// Application Settings
this.keywords = ['budget', 'police', 'housing', 'development', 'mayor', 'council'];
this.checkIntervalMinutes = 15;  // Default auto-check interval
this.apiUrl = 'https://nola.gov/next/news/';

// UI Settings
this.activeKeywords = new Set(this.keywords);  // All keywords active by default
this.notificationsEnabled = false;  // Requires user permission
this.autoCheckEnabled = false;      // Manual activation required
```

### localStorage Schema
```javascript
// Main application data
'nola_monitor_data': {
    lastCheck: timestamp,
    currentNews: [newsItem, ...],
    previousNews: [newsItem, ...]
}

// Auto-check settings
'nola_monitor_autocheck': {
    enabled: boolean,
    interval: minutes
}

// Check history
'nola_monitor_history': [
    {
        timestamp: number,
        newsCount: number,
        changesCount: number
    }, ...
]
```

### News Item Data Structure
```javascript
{
    id: string,              // Unique identifier
    title: string,           // Article headline
    url: string,             // Link to full article
    date: string,            // Publication date
    source: string,          // 'NOPD News' | 'City of New Orleans'
    excerpt: string,         // Article summary/description
    timestamp: number,       // Unix timestamp for sorting
    isNew?: boolean         // Flag for newly detected items
}
```

## 🔍 HTML Parsing Strategy

### Target Website Structure Analysis
The nola.gov/next/news/ page contains:
- News items in `<h3>` tags with `<a>` links
- Mixed content: city statements, police reports, meeting notices
- Date/source information in adjacent text nodes
- Links to both nola.gov and nopdnews.com domains

### Parsing Implementation
```javascript
parseNewsFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Target: h3 a[href*="/"], h3 a[href*="nopdnews.com"]
    const articleElements = doc.querySelectorAll('h3 a[href*="/"], h3 a[href*="nopdnews.com"]');
    
    articleElements.forEach((linkElement, index) => {
        // Extract title from link text
        const title = linkElement.textContent.trim();
        
        // Get URL and fix localhost issues
        let url = linkElement.getAttribute('href') || linkElement.href;
        url = this.fixUrl(url);
        
        // Find container for additional metadata
        const container = linkElement.closest('div') || linkElement.parentElement;
        const textContent = container.textContent || '';
        
        // Extract date using regex
        const dateMatch = textContent.match(/([A-Z][a-z]+ \d{1,2}, \d{4})/);
        const date = dateMatch ? dateMatch[1] : 'Recent';
        
        // Determine source
        const source = textContent.includes('From NOPD News') ? 'NOPD News' : 'City of New Orleans';
        
        // Extract excerpt (first meaningful line after title)
        const excerpt = this.extractExcerpt(textContent, title);
        
        // Create news item object
        newsItems.push({ id, title, url, date, source, excerpt, timestamp });
    });
    
    return newsItems;
}
```

## 🚨 Error Handling & Resilience

### Network Error Handling
```javascript
// CORS proxy fallback system
try {
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
} catch (proxyError) {
    console.log(`Proxy failed: ${proxyError.message}`);
    // Try next proxy or show user-friendly error
}
```

### Data Validation
```javascript
// Validate news items before processing
if (title && title.length > 3 && url) {
    newsItems.push(newsItem);
} else {
    console.warn('Invalid news item skipped:', { title, url });
}
```

### UI Error States
- **Loading States**: Visual spinners and status messages
- **Error Messages**: User-friendly error descriptions
- **Graceful Degradation**: App continues working if some features fail
- **Debug Information**: Console logging for troubleshooting

## 🔒 Security Considerations

### Input Validation
- All user inputs are validated before processing
- HTML parsing uses browser's built-in DOMParser (safe)
- No eval() or innerHTML with user content

### Data Storage
- Only non-sensitive data stored in localStorage
- No API keys or credentials in frontend code
- Data automatically expires and can be cleared

### External Requests
- CORS proxies are public services (no authentication required)
- No sensitive data transmitted to proxies
- Fallback system prevents single point of failure

## 📊 Performance Characteristics

### Memory Usage
- **Baseline**: ~2-5MB for application code and DOM
- **Per News Item**: ~1-2KB in memory
- **localStorage**: ~10-50KB for typical usage
- **Auto-cleanup**: Old history items automatically pruned

### Network Usage
- **Per Check**: ~50-200KB HTML download
- **Frequency**: User-configurable (5min - 6hr intervals)
- **Caching**: Browser handles HTTP caching of static assets
- **Optimization**: Only changed data triggers notifications

### Browser Compatibility
- **Modern Browsers**: Full feature support (Chrome 60+, Firefox 55+, Safari 11+, Edge 79+)
- **Older Browsers**: Graceful degradation (some features may not work)
- **Mobile**: Fully responsive, touch-friendly interface

## 🧪 Testing & Debugging

### Manual Testing Checklist
- [ ] Fresh data fetching (not cached)
- [ ] URL fixing (no localhost links)
- [ ] Change detection accuracy
- [ ] Keyword filtering functionality
- [ ] Browser notifications
- [ ] Auto-check operation
- [ ] Data persistence across sessions
- [ ] Mobile responsiveness

### Debug Tools
```javascript
// Console debugging commands
localStorage.clear(); location.reload();  // Reset app
window.monitor.checkForUpdates();         // Manual check
new Notification('Test');                 // Test notifications
console.log(window.monitor.currentNews); // Inspect data
```

### Common Debug Scenarios
1. **No data loading**: Check CORS proxy status in console
2. **Wrong URLs**: Verify URL fixing logic with console logs
3. **No notifications**: Check permission status and browser settings
4. **Auto-check stops**: Verify tab remains active and interval is set

## 🚀 Deployment Options

### Development
- **Local Server**: Python http.server or Node.js http-server
- **Live Reload**: VS Code Live Server extension
- **Debug Tools**: Browser developer tools with source maps

### Production
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFlare for global distribution
- **Backend Proxy**: Custom server to replace CORS proxies
- **Database**: PostgreSQL or MongoDB for data persistence

---

**Document Version**: 1.0.0  
**Last Updated**: August 8, 2025  
**Compatibility**: Modern browsers (ES6+ support required)
