# ONA25 Workshop MVP Development Log

## Project Summary

**Goal**: Create a functional MVP of a City Hall Monitor tool for testing the ONA25 workshop approach before the actual event.

**Target**: Monitor https://nola.gov/next/news/ for newsworthy changes that journalists should know about.

**Status**: ✅ **COMPLETE** - Fully functional MVP with real-time data fetching, automation, and notifications.

## Development Timeline

### Phase 1: Research & Analysis
- **Analyzed target website structure** (nola.gov/next/news/)
- **Identified data patterns**: News items with titles, dates, sources (NOPD News vs City of New Orleans), and excerpts
- **Confirmed mix of content**: City statements, police reports, ethics meetings, planning notices

### Phase 2: Core Implementation
- **Built responsive web interface** with modern CSS and clean UX
- **Implemented keyword filtering** (budget, police, housing, development, mayor, council)
- **Created newsworthiness scoring** (1-5 scale based on keywords, source, recency)
- **Added change detection** logic to compare current vs previous data

### Phase 3: Automation & Notifications
- **Added periodic auto-checking** (5 minutes to 6 hours intervals)
- **Implemented browser notifications** with permission handling
- **Created persistent settings** using localStorage
- **Added audio notification cues** for new items

### Phase 4: Data Fetching & CORS Resolution
- **Initial approach**: Used simulated data (rejected - must be real)
- **Second approach**: Used api.allorigins.win proxy (CORS blocked)
- **Final solution**: Multiple CORS proxy fallbacks with robust error handling

### Phase 5: URL Fixing & Real-time Fetching
- **Problem identified**: App showed cached data instantly instead of fetching fresh data
- **Root cause**: Auto-displaying localStorage data on startup
- **Solution**: Removed auto-display, ensured all checks fetch fresh data from web
- **URL fixing**: Comprehensive localhost-to-nola.gov replacement logic

## Key Technical Solutions

### 1. CORS Proxy Fallback System
```javascript
const proxies = [
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.codetabs.com/v1/proxy?quest='
];
```
**Why this works**: If one proxy fails, automatically tries the next until successful.

### 2. Real-time vs Cached Data
```javascript
// DON'T auto-display cached data on startup
// DO require manual "Check for Updates" for fresh data
console.log('Loaded cached data but not displaying - click "Check for Updates" for fresh data');
```
**Why this matters**: Ensures journalists always get current information, not stale cache.

### 3. Comprehensive URL Fixing
```javascript
if (url && url.includes('localhost')) {
    url = url.replace(/https?:\/\/localhost(:\d+)?/, 'https://nola.gov');
} else if (url && url.startsWith('/')) {
    url = 'https://nola.gov' + url;
}
```
**Why this works**: Handles both absolute localhost URLs and relative paths.

### 4. Robust Event Listener Setup
```javascript
const clearBtn = document.getElementById('clearHistoryBtn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        console.log('Clear button clicked');
        this.clearHistory();
    });
}
```
**Why this matters**: Prevents JavaScript errors if DOM elements don't exist.

## Workshop-Ready Features

### ✅ Core Functionality
- **Real-time news fetching** from nola.gov
- **Change detection** between checks
- **Keyword highlighting** for relevant content
- **Newsworthiness scoring** (1-5 scale)
- **Clean, responsive interface**

### ✅ Automation
- **Configurable auto-checking** (5min - 6hr intervals)
- **Browser notifications** for new items
- **Audio alerts** for attention
- **Persistent settings** across sessions

### ✅ Data Management
- **localStorage persistence** for history
- **Change tracking** over time
- **Manual data clearing** functionality
- **Error handling** for network issues

### ✅ Developer Experience
- **Comprehensive debugging** with console logs
- **Clear error messages** for troubleshooting
- **Modular code structure** for easy modification
- **Detailed comments** explaining logic

## Lessons Learned

### 1. **Real Data is Non-Negotiable**
- Simulated data doesn't demonstrate the core value proposition
- Journalists need to see actual, current information
- CORS challenges are worth solving for authenticity

### 2. **Caching Can Hide Problems**
- Auto-displaying cached data masks real-time fetching issues
- Always test with fresh data to verify functionality
- Clear visual indicators help distinguish cached vs live data

### 3. **Multiple Fallbacks Are Essential**
- Single CORS proxy will eventually fail
- Graceful degradation improves reliability
- User experience shouldn't suffer from technical limitations

### 4. **Debugging is Teaching**
- Comprehensive console logging helps workshop participants
- Clear error messages reduce frustration
- Visible state changes build confidence

## Workshop Facilitation Tips

### For Participants Who Get Stuck

1. **"My tool isn't fetching new data"**
   - Check if they're auto-displaying cached data
   - Verify CORS proxy is working
   - Look for JavaScript errors in console

2. **"Links go to localhost instead of real site"**
   - Show URL fixing logic in our implementation
   - Explain relative vs absolute URL resolution
   - Demonstrate testing with console commands

3. **"Notifications aren't working"**
   - Check if permission was granted
   - Verify notification code is being called
   - Test with manual notification in console

4. **"Auto-check stops working"**
   - Explain that tab must stay open for setInterval
   - Show how to check if interval is still running
   - Demonstrate state persistence across page reloads

### Demonstration Flow

1. **Show the problem**: Manual checking of multiple city pages
2. **Demo the solution**: Our working monitor in action
3. **Explain the value**: "This can't be done in ChatGPT"
4. **Guide the build**: Step-by-step with safety checks
5. **Troubleshoot together**: Use our working version as reference

## Production Deployment Considerations

### Immediate Next Steps
- **Backend proxy service** to replace CORS proxies
- **Database storage** instead of localStorage
- **Email/SMS notifications** for off-hours alerts
- **Multiple city pages** monitoring

### Advanced Features
- **Natural language processing** for better content analysis
- **Machine learning** for newsworthiness prediction
- **Integration APIs** for CMS/workflow systems
- **Team collaboration** features

## Files Created

| File | Purpose | Key Features |
|------|---------|--------------|
| `index.html` | Main interface | Responsive design, automation controls, filter toggles |
| `style.css` | Visual styling | Modern UI, mobile-friendly, status indicators |
| `monitor.js` | Core logic | Real-time fetching, change detection, notifications |
| `README.md` | Documentation | Usage instructions, technical notes |
| `workshop-troubleshooting-guide.md` | Workshop support | Common issues, solutions, debugging tips |

## Success Metrics

### Technical Achievement
- ✅ Real-time data fetching from live government website
- ✅ Reliable CORS proxy system with fallbacks
- ✅ Automated monitoring with configurable intervals
- ✅ Browser notifications with permission handling
- ✅ Persistent data storage and history tracking
- ✅ Comprehensive error handling and debugging

### Workshop Readiness
- ✅ Working reference implementation for troubleshooting
- ✅ Clear documentation of common issues and solutions
- ✅ Step-by-step debugging commands for participants
- ✅ Modular code structure for incremental teaching
- ✅ Visual feedback for all user actions
- ✅ Professional UI that demonstrates production potential

## Final Assessment

**The MVP successfully demonstrates the core workshop thesis**: AI assistants can build persistent, automated tools that provide ongoing value beyond what ChatGPT alone can offer.

**Key differentiators from ChatGPT**:
- ✅ Runs continuously without manual prompts
- ✅ Stores and compares data over time
- ✅ Sends proactive alerts when changes occur
- ✅ Maintains state across browser sessions
- ✅ Operates in background while user focuses on other work

**Workshop participants will leave with**:
- A working monitoring tool for their beat
- Understanding of incremental AI-assisted development
- Confidence to build more sophisticated tools
- Practical experience with real-world technical challenges

The MVP is ready for workshop deployment and will serve as both a teaching tool and a troubleshooting reference for participants who encounter issues during the hands-on session.

---

**Development completed**: August 8, 2025  
**Total development time**: ~4 hours  
**Status**: Production-ready MVP for workshop use
