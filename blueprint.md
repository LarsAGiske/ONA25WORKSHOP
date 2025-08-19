# City Hall News Monitor - Development Blueprint

## Executive Summary

This blueprint outlines the development of an automated news monitoring tool for local journalists covering city government. The tool addresses the critical need for real-time awareness of city hall announcements, policy changes, and breaking news without requiring constant manual website checking.

## Problem Statement

### The Journalist's Challenge

Local news reporters covering city government face several pain points:

1. **Manual Monitoring Fatigue**: Constantly refreshing government websites throughout the day
2. **Fear of Missing Stories**: Anxiety about competitors breaking news first
3. **Information Overload**: Difficulty filtering signal from noise in government communications
4. **Resource Constraints**: Limited time to monitor multiple sources while writing stories
5. **Reactive Coverage**: Learning about news after it's already been reported elsewhere
6. **Lack of Historical Context**: No easy way to track patterns in government communications

### Current Workflow Issues

Journalists typically:
- Manually check city websites 10-20 times per day
- Rely on press releases that may arrive late or be buried in email
- Miss weekend/evening announcements when not actively working
- Struggle to identify trending topics or patterns in city communications
- Waste time reading irrelevant meeting notices and routine announcements

## User Needs Analysis

### Primary Users: Local Government Reporters

**Core Needs:**
- Immediate awareness of new city hall announcements
- Ability to filter for beat-relevant topics (crime, budget, housing, etc.)
- Historical tracking to identify patterns and trends
- Mobile accessibility for monitoring while in the field
- Non-intrusive alerts that don't interrupt writing flow

### Secondary Users: News Editors

**Core Needs:**
- Overview of government activity for planning coverage
- Ability to assign stories based on detected news
- Metrics on government communication patterns
- Integration with newsroom workflow systems

### Tertiary Users: Investigative Teams

**Core Needs:**
- Long-term data collection for pattern analysis
- Keyword tracking for ongoing investigations
- Change detection in government policies/personnel
- Archive of government communications

## Solution Overview

### Core Concept

An automated web monitoring tool that:
1. Continuously checks city government news pages
2. Detects new or changed content
3. Filters and prioritizes based on newsworthiness
4. Alerts journalists via multiple channels
5. Maintains searchable history for pattern analysis

### Key Differentiators

**Why This Can't Be Done with AI Chatbots:**
- Requires persistent, continuous operation
- Needs stateful change detection over time
- Must proactively alert without user prompts
- Requires integration with external notification systems
- Needs to maintain historical data across sessions

## Feature Requirements

### Must-Have Features (MVP)

1. **Automated Monitoring**
   - Check city news page at configurable intervals
   - Run continuously without user intervention
   - Handle network failures gracefully

2. **Change Detection**
   - Identify new articles since last check
   - Detect removed/modified content
   - Timestamp all changes for audit trail

3. **Smart Filtering**
   - Keyword-based relevance filtering
   - Newsworthiness scoring algorithm
   - Customizable filter preferences

4. **Multi-Channel Alerts**
   - Browser desktop notifications
   - Audio alerts for urgent news
   - Visual indicators in browser tab

5. **Data Persistence**
   - Save monitoring history
   - Maintain user preferences
   - Survive browser restarts

### Should-Have Features (Phase 2)

1. **Advanced Analysis**
   - Sentiment analysis of announcements
   - Entity extraction (people, organizations, places)
   - Topic clustering and trend detection

2. **Enhanced Notifications**
   - Email alerts for high-priority items
   - SMS notifications for breaking news
   - Slack/Teams integration

3. **Multi-Source Support**
   - Monitor multiple government pages
   - Track social media accounts
   - RSS feed integration

4. **Collaboration Features**
   - Share findings with team members
   - Assign stories to reporters
   - Add notes and context to items

### Nice-to-Have Features (Phase 3)

1. **Predictive Analytics**
   - Predict news cycles based on patterns
   - Identify unusual government activity
   - Alert on communication anomalies

2. **API Access**
   - RESTful API for third-party integration
   - Webhook support for automation
   - Data export capabilities

3. **Advanced UI**
   - Dashboard with analytics
   - Mobile native applications
   - Browser extension version

## Technical Architecture

### System Design Principles

1. **Progressive Enhancement**: Start simple, add complexity incrementally
2. **Resilience**: Handle failures gracefully with fallback mechanisms
3. **Performance**: Minimize resource usage and network calls
4. **Security**: No sensitive data exposure, secure storage
5. **Accessibility**: WCAG 2.1 AA compliance for all users

### Tech Stack Selection

#### Frontend (MVP)

**Core Technologies:**
- HTML5: Semantic, accessible markup
- CSS3: Modern, responsive styling without frameworks
- Vanilla JavaScript (ES6+): No framework dependencies

**Rationale:**
- Zero build process required
- Maximum browser compatibility
- Minimal learning curve for contributors
- Easy deployment anywhere

#### Backend Considerations

**Initial Approach (MVP):**
- Client-side only with CORS proxies
- Browser localStorage for persistence
- No server infrastructure required

**Production Approach:**
- Node.js/Express backend for reliability
- PostgreSQL for data persistence
- Redis for caching and rate limiting
- Docker containerization for deployment

#### External Services

**CORS Proxies (MVP):**
```javascript
const PROXY_SERVICES = [
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://api.codetabs.com/v1/proxy?quest='
];
```

**Production Services:**
- Custom proxy server with caching
- SendGrid/Mailgun for email notifications
- Twilio for SMS alerts
- Sentry for error tracking

### Data Architecture

#### News Item Schema
```typescript
interface NewsItem {
  id: string;              // Unique identifier
  title: string;           // Headline text
  url: string;            // Link to full article
  date: string;           // Publication date
  source: string;         // Department/agency
  excerpt: string;        // Summary text
  timestamp: number;      // Detection timestamp
  keywords: string[];     // Matched keywords
  score: number;          // Newsworthiness 1-5
  isNew: boolean;         // Newly detected flag
}
```

#### Storage Schema
```typescript
interface StorageSchema {
  currentNews: NewsItem[];
  previousNews: NewsItem[];
  lastCheck: number;
  settings: {
    keywords: string[];
    activeFilters: string[];
    checkInterval: number;
    notificationsEnabled: boolean;
  };
  history: {
    timestamp: number;
    newsCount: number;
    changesDetected: number;
  }[];
}
```

## Development Process (Test-Driven)

### TDD Methodology

Every feature follows strict Red-Green-Refactor cycle:

1. **Red**: Write failing test for desired behavior
2. **Green**: Write minimal code to pass test
3. **Refactor**: Improve code while keeping tests green

### Development Phases

#### Phase 1: Core Data Fetching (Week 1)

**Test Sequence:**
```javascript
// Test 1: Should fetch HTML from target URL
describe('News Fetcher', () => {
  it('should retrieve HTML content from city news page', async () => {
    const html = await fetcher.fetch('https://nola.gov/news');
    expect(html).toContain('<html');
    expect(html.length).toBeGreaterThan(1000);
  });
});

// Test 2: Should handle network failures
it('should retry with fallback proxies on failure', async () => {
  // Mock first proxy failure
  const html = await fetcher.fetch(url);
  expect(fetchSpy).toHaveBeenCalledTimes(3);
  expect(html).toBeDefined();
});

// Test 3: Should parse news items from HTML
it('should extract news items with required fields', () => {
  const items = parser.parse(mockHTML);
  expect(items[0]).toHaveProperty('title');
  expect(items[0]).toHaveProperty('url');
  expect(items[0]).toHaveProperty('date');
});
```

**Implementation Steps:**
1. Create fetch wrapper with timeout
2. Implement proxy fallback logic
3. Build HTML parser for news extraction
4. Add URL normalization

#### Phase 2: Change Detection (Week 2)

**Test Sequence:**
```javascript
// Test 1: Should detect new items
it('should identify newly added news items', () => {
  const previous = [item1, item2];
  const current = [item1, item2, item3];
  const changes = detector.detectChanges(previous, current);
  expect(changes.new).toContain(item3);
  expect(changes.new).toHaveLength(1);
});

// Test 2: Should detect removed items
it('should identify removed news items', () => {
  const previous = [item1, item2, item3];
  const current = [item1, item3];
  const changes = detector.detectChanges(previous, current);
  expect(changes.removed).toContain(item2);
});

// Test 3: Should handle edge cases
it('should handle empty arrays gracefully', () => {
  const changes = detector.detectChanges([], []);
  expect(changes.new).toHaveLength(0);
  expect(changes.removed).toHaveLength(0);
});
```

**Implementation Steps:**
1. Create unique ID generation for items
2. Implement comparison algorithm
3. Add change categorization
4. Build change history tracking

#### Phase 3: Filtering & Scoring (Week 3)

**Test Sequence:**
```javascript
// Test 1: Should identify keywords in content
it('should find relevant keywords in news item', () => {
  const item = { title: 'Mayor announces budget cuts' };
  const keywords = filter.findKeywords(item);
  expect(keywords).toContain('mayor');
  expect(keywords).toContain('budget');
});

// Test 2: Should calculate newsworthiness
it('should score items based on relevance', () => {
  const highPriority = { 
    title: 'BREAKING: Mayor announces emergency budget meeting',
    keywords: ['mayor', 'budget', 'emergency']
  };
  const lowPriority = { 
    title: 'Parks department updates hours',
    keywords: []
  };
  expect(scorer.calculate(highPriority)).toBe(5);
  expect(scorer.calculate(lowPriority)).toBe(1);
});

// Test 3: Should filter based on user preferences
it('should only show items matching active filters', () => {
  const items = [policeItem, budgetItem, parksItem];
  const activeFilters = ['police', 'budget'];
  const filtered = filter.apply(items, activeFilters);
  expect(filtered).toHaveLength(2);
  expect(filtered).not.toContain(parksItem);
});
```

**Implementation Steps:**
1. Build keyword extraction logic
2. Create scoring algorithm
3. Implement filter system
4. Add user preference management

#### Phase 4: Notifications (Week 4)

**Test Sequence:**
```javascript
// Test 1: Should request notification permission
it('should request browser notification permission', async () => {
  const permission = await notifier.requestPermission();
  expect(Notification.requestPermission).toHaveBeenCalled();
});

// Test 2: Should send notifications for new items
it('should create notification with correct content', () => {
  const item = { title: 'Breaking News', excerpt: 'Details...' };
  notifier.notify(item);
  expect(Notification).toHaveBeenCalledWith(
    'Breaking News',
    expect.objectContaining({ body: 'Details...' })
  );
});

// Test 3: Should respect user preferences
it('should not notify if disabled in settings', () => {
  settings.notificationsEnabled = false;
  notifier.notify(item);
  expect(Notification).not.toHaveBeenCalled();
});
```

**Implementation Steps:**
1. Create permission request flow
2. Build notification factory
3. Add audio alert system
4. Implement notification queue

#### Phase 5: Automation (Week 5)

**Test Sequence:**
```javascript
// Test 1: Should run checks at specified interval
it('should execute checks at configured interval', () => {
  jest.useFakeTimers();
  monitor.startAutoCheck(5); // 5 minutes
  jest.advanceTimersByTime(5 * 60 * 1000);
  expect(checkSpy).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(5 * 60 * 1000);
  expect(checkSpy).toHaveBeenCalledTimes(2);
});

// Test 2: Should stop when requested
it('should cancel interval on stop', () => {
  const intervalId = monitor.startAutoCheck(5);
  monitor.stopAutoCheck();
  jest.advanceTimersByTime(10 * 60 * 1000);
  expect(checkSpy).toHaveBeenCalledTimes(0);
});

// Test 3: Should persist settings
it('should save and restore automation settings', () => {
  monitor.setAutoCheck(true, 15);
  const saved = localStorage.getItem('autocheck');
  expect(JSON.parse(saved)).toEqual({
    enabled: true,
    interval: 15
  });
});
```

**Implementation Steps:**
1. Implement interval management
2. Add background check logic
3. Create persistence layer
4. Build status indicators

### Testing Strategy

#### Unit Tests
- Test individual functions in isolation
- Mock external dependencies
- Achieve 100% code coverage
- Focus on business logic

#### Integration Tests
- Test module interactions
- Verify data flow through system
- Test error propagation
- Validate state management

#### E2E Tests
- Simulate real user workflows
- Test across different browsers
- Verify notification behavior
- Test persistence across sessions

### Code Quality Standards

#### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

#### Linting Rules
- ESLint with strict configuration
- Prettier for consistent formatting
- No console.log in production
- No any types allowed
- Maximum complexity: 10

## Implementation Timeline

### Week 1: Foundation
- Set up development environment
- Implement data fetching with tests
- Create basic HTML parser
- Deploy MVP to test environment

### Week 2: Core Features
- Add change detection algorithm
- Implement storage layer
- Create basic UI structure
- Add manual check functionality

### Week 3: Intelligence Layer
- Build keyword filtering
- Implement scoring algorithm
- Add user preference management
- Create filter UI components

### Week 4: User Experience
- Implement notifications
- Add audio alerts
- Create responsive design
- Build history view

### Week 5: Automation
- Add auto-check functionality
- Implement background operation
- Create status indicators
- Add error recovery

### Week 6: Polish & Deploy
- Performance optimization
- Cross-browser testing
- Documentation completion
- Production deployment

## Success Metrics

### Technical Metrics
- Page load time < 2 seconds
- Check execution < 5 seconds
- 100% test coverage
- Zero critical bugs
- 99.9% uptime

### User Metrics
- 50% reduction in time spent checking websites
- 90% of breaking news detected within 5 minutes
- 80% user satisfaction rating
- 60% daily active usage rate
- 10x ROI on time saved vs development cost

### Business Impact
- Faster news publication times
- Increased story volume
- Better investigative leads
- Improved competitive position
- Enhanced reader engagement

## Risk Analysis

### Technical Risks

1. **Website Structure Changes**
   - Mitigation: Flexible parsing with fallbacks
   - Monitoring: Automated tests for parser

2. **CORS/Proxy Failures**
   - Mitigation: Multiple proxy services
   - Backup: Self-hosted proxy server

3. **Rate Limiting**
   - Mitigation: Configurable check intervals
   - Solution: Distributed checking

### User Adoption Risks

1. **Learning Curve**
   - Mitigation: Intuitive UI design
   - Support: Comprehensive documentation

2. **Trust in Automation**
   - Mitigation: Transparent operation
   - Validation: Manual verification option

3. **Alert Fatigue**
   - Mitigation: Smart filtering
   - Customization: Granular preferences

## Production Deployment Strategy

### Infrastructure Requirements

**Minimum (MVP):**
- Static file hosting (Netlify/Vercel)
- HTTPS certificate
- CDN for global distribution

**Recommended (Production):**
- Load-balanced Node.js servers
- PostgreSQL database cluster
- Redis cache layer
- Monitoring (Datadog/New Relic)
- Error tracking (Sentry)

### Deployment Pipeline

1. **Development**: Local development with hot reload
2. **Testing**: Automated CI/CD with GitHub Actions
3. **Staging**: Preview deployments for testing
4. **Production**: Blue-green deployment strategy
5. **Monitoring**: Real-time performance tracking

### Security Considerations

- No sensitive data in frontend code
- Input sanitization for all user data
- Rate limiting on API endpoints
- Regular security audits
- GDPR/CCPA compliance

## Future Enhancements

### Machine Learning Integration
- Natural language processing for better categorization
- Predictive models for news importance
- Anomaly detection in government communications
- Automated summary generation

### Platform Expansion
- Native mobile applications
- Browser extension
- Desktop application
- API for third-party integration

### Advanced Features
- Multi-language support
- Voice notifications
- AI-powered insights
- Collaborative annotation
- Custom report generation

## Conclusion

This blueprint provides a comprehensive roadmap for developing a city hall news monitoring tool that addresses real journalist needs while maintaining high technical standards. The test-driven development approach ensures reliability, the progressive enhancement strategy allows for incremental delivery of value, and the focus on user needs guarantees practical utility.

The tool represents a significant advancement over manual monitoring, offering journalists the ability to stay ahead of news cycles while focusing on high-value reporting activities. By automating the mundane task of website checking, reporters can dedicate more time to investigation, analysis, and storytelling - ultimately serving their communities better.

---

**Document Version**: 1.0.0  
**Created**: August 2025  
**Target Audience**: Development team, stakeholders, workshop participants  
**Status**: Ready for implementation