# NOLA City Hall Monitor - MVP

A web-based tool that monitors the New Orleans city government news page for newsworthy changes. Built as a test for the ONA25 workshop on newsroom innovation.

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Python 3.x (for local server) OR any local web server

### Step-by-Step Setup

1. **Download/Clone the Project**
   ```bash
   # If using git
   git clone [repository-url]
   cd ona25workshop
   
   # OR download and extract the ZIP file
   ```

2. **Start a Local Web Server**
   
   **Option A: Using Python (Recommended)**
   ```bash
   # Navigate to the project directory
   cd ona25workshop
   
   # Start Python web server
   python -m http.server 8000
   
   # OR if you have Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Using Node.js**
   ```bash
   # Install http-server globally
   npm install -g http-server
   
   # Start server
   http-server -p 8000
   ```
   
   **Option C: Using VS Code Live Server**
   - Install "Live Server" extension
   - Right-click on `index.html`
   - Select "Open with Live Server"

3. **Open in Browser**
   - Navigate to `http://localhost:8000`
   - You should see the NOLA City Hall Monitor interface

4. **Test the Application**
   - Click "🔍 Check for Updates" button
   - Wait 2-3 seconds for data to load from nola.gov
   - Verify news items appear with proper links
   - Test keyword filtering by clicking filter tags
   - Try enabling auto-check functionality

## 🎯 Features

### Core Monitoring
- **🔍 Real-time News Fetching**: Pulls fresh data from nola.gov/next/news/
- **🎯 Keyword Filtering**: Highlights articles containing: budget, police, housing, development, mayor, council
- **🔔 Change Detection**: Identifies new/removed articles since last check
- **📊 Newsworthiness Scoring**: Rates articles 1-5 based on keywords, source, and recency

### Automation & Alerts
- **🤖 Auto-checking**: Configurable intervals from 5 minutes to 6 hours
- **🔔 Browser Notifications**: Desktop alerts for new items (requires permission)
- **🔊 Audio Cues**: Subtle notification sounds for new content
- **💾 Persistent Settings**: Remembers your preferences across sessions

### User Experience
- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **🎨 Modern Interface**: Clean, professional design suitable for newsrooms
- **📊 History Tracking**: Maintains log of all monitoring sessions
- **🗑️ Data Management**: Easy clearing of history and cached data

## 🔧 How to Use

### Basic Operation
1. **Initial Setup**: Open the app and allow browser notifications when prompted
2. **First Check**: Click "Check for Updates" to fetch current news
3. **Review Results**: Browse news items, noting highlighted keywords and newsworthiness scores
4. **Customize Filters**: Click keyword tags to toggle filtering on/off

### Automation Setup
1. **Enable Auto-check**: Click "▶️ Start Auto Check" button
2. **Set Interval**: Choose checking frequency from dropdown (15 minutes recommended)
3. **Background Operation**: Keep browser tab open for continuous monitoring
4. **Receive Alerts**: Get desktop notifications when new items are detected

### Data Management
- **View History**: Scroll down to see past monitoring sessions
- **Clear Data**: Use "🗑️ Clear History" to reset all stored data
- **Export**: Copy news items from interface for external use

## 🛠️ Technical Architecture

### Frontend Stack
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with Flexbox/Grid, responsive design
- **Vanilla JavaScript**: No frameworks, pure ES6+ for maximum compatibility

### Data Sources
- **Primary**: https://nola.gov/next/news/ (via CORS proxy)
- **CORS Proxies**: Multiple fallback proxies for reliability
- **Storage**: Browser localStorage for persistence

### Key Components
- **NolaNewsMonitor Class**: Main application controller
- **CORS Proxy System**: Handles cross-origin data fetching
- **Change Detection Engine**: Compares current vs previous data
- **Notification System**: Browser notifications with permission handling
- **Auto-check Scheduler**: setInterval-based background monitoring

## 🔍 Troubleshooting

### Common Issues

**"No data appears when I click Check for Updates"**
- Check browser console (F12) for error messages
- Verify internet connection
- Try refreshing the page and clicking again

**"Links go to localhost instead of nola.gov"**
- This is a known issue that should be automatically fixed
- Check console for URL fixing messages
- Refresh page if issue persists

**"Auto-check stops working"**
- Browser tab must remain open for auto-checking
- Check if browser is throttling background tabs
- Disable browser power saving features

**"Notifications don't appear"**
- Ensure you granted notification permission
- Check browser notification settings
- Test with: `new Notification('Test')`

### Debug Commands
Open browser console (F12) and try:
```javascript
// Clear all data
localStorage.clear(); location.reload();

// Test notification
new Notification('Test notification');

// Check if monitor is running
console.log('Monitor exists:', typeof window.monitor);

// Manual data fetch
window.monitor.checkForUpdates();
```

## 📁 Project Structure

```
ona25workshop/
├── index.html                          # Main application interface
├── style.css                           # Responsive styling and themes
├── monitor.js                          # Core monitoring logic
├── README.md                           # This documentation
├── workshop-troubleshooting-guide.md   # Workshop support guide
├── project-development-log.md          # Development history
└── technical-documentation.md          # Detailed tech specs
```

## 🎓 Workshop Context

This MVP demonstrates core concepts for the ONA25 workshop:

### Why This Can't Be Done in ChatGPT
- **Persistent Operation**: Runs continuously without manual prompts
- **State Management**: Remembers previous checks and detects changes
- **Background Processing**: Operates while user focuses on other tasks
- **Real-time Alerts**: Proactively notifies about new developments
- **Data Persistence**: Maintains history across browser sessions

### Learning Objectives
- Understanding incremental AI-assisted development
- Building tools that provide ongoing value beyond single interactions
- Implementing real-world features like notifications and automation
- Handling technical challenges like CORS and data persistence

## 🚀 Production Deployment

### Immediate Enhancements
- **Backend Proxy**: Replace CORS proxies with dedicated backend service
- **Database Storage**: Use PostgreSQL/MongoDB instead of localStorage
- **Email Alerts**: Integrate with SendGrid/Mailgun for email notifications
- **Multi-source Monitoring**: Add city council, permits, budget pages

### Advanced Features
- **Natural Language Processing**: Better content analysis and categorization
- **Machine Learning**: Predictive newsworthiness scoring
- **Team Collaboration**: Multi-user access with role-based permissions
- **API Integration**: Connect to CMS and workflow systems
- **Mobile App**: Native iOS/Android applications

### Scaling Considerations
- **Rate Limiting**: Respect website's robots.txt and implement delays
- **Error Handling**: Robust retry logic and graceful degradation
- **Security**: Input validation, HTTPS, secure API keys
- **Performance**: Caching strategies and optimized data structures

## 📞 Support

For workshop participants:
- Check `workshop-troubleshooting-guide.md` for common issues
- Review `technical-documentation.md` for detailed architecture
- Use browser console debugging commands above
- Ask facilitators for hands-on help

## 📄 License

This project is created for educational purposes as part of the ONA25 workshop on newsroom innovation.

---

**Last Updated**: August 8, 2025  
**Version**: 1.0.0 (Workshop MVP)  
**Status**: Production-ready for workshop use
