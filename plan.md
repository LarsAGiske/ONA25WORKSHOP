# ONA 2025 Workshop: Building a City Hall Monitor Tool (90 minutes)

## The Concrete Tool: NOLA City Hall Watch

A web-based tool that automatically checks nola.gov for updates and alerts journalists to newsworthy changes in:
- City Council meeting agendas
- Mayor's press releases
- Public notices
- Permit applications
- Budget documents

This CAN'T be done in ChatGPT because it needs to:
- Run automatically every day
- Compare changes over time
- Send alerts
- Store historical data
- Work without manual prompting

## Workshop Structure

### Part 1: Blueprint Design (30 min)

**0:00-0:10 - The Problem Demo**
- Show manually checking 5 different city pages (tedious!)
- Show what you might miss between checks
- Demo the finished tool: "Look what it caught overnight!"

**0:10-0:25 - Design Your Monitor Together**

Lead participants through this blueprint conversation:

```
I need a tool that monitors New Orleans city government website for newsworthy changes.

Every day it should check:
- City Council agenda page: [URL]
- Mayor's office press releases: [URL]
- Public notices: [URL]
- Major permits: [URL]

When it finds something new, it should:
- Flag items with these keywords: [budget, police, housing, development]
- Show me what changed since yesterday
- Rate newsworthiness (1-5) based on my beat
- Give me a daily digest email at 8 AM

The tool needs to:
- Run automatically without me doing anything
- Keep 30 days of history
- Let me search past findings
- Export to CSV for records
```

**0:25-0:30 - Customize for Your Beat**

Participants modify the blueprint for their city/beat:
- What sites to monitor
- What keywords matter
- When to get alerts

### Part 2: Building the Tool (55 min)

**0:30-0:35 - Essential Safety Instructions (5 min)**

Share the "AI Assistant Instructions" card (see below)

**0:35-0:50 - Claude Code Creates Core (15 min)**

Everyone types the same prompt with safety instructions:

```
Build a web monitoring tool for journalists that:
1. Scrapes specified city government pages daily
2. Detects changes from previous scrape
3. Highlights newsworthy items based on keywords
4. Stores history in browser storage
5. Has a simple dashboard showing today's findings

Start with monitoring: https://nola.gov/mayor/news/
Look for new press releases and flag anything mentioning: crime, budget, housing

Make it run locally in my browser with a "Check Now" button and show the results in a clean table.

IMPORTANT INSTRUCTIONS FOR YOU:
- Build this incrementally - start simple and working
- Test each feature before adding the next
- Never put API keys or passwords in the code
- Validate all user inputs
- Handle errors gracefully
- Make the code readable with clear variable names
```

**0:50-1:10 - Enhance with Windsurf/Cursor (20 min)**

Add features one at a time:
1. Add another URL to monitor
2. Customize keywords for your beat
3. Add CSV export
4. Professional styling
5. Newsworthiness scoring

After each enhancement, tell the AI:
```
Test that this still works before we continue.
```

**1:10-1:15 - Security Review (5 min)**

In Windsurf/Cursor, type:
```
/security-review

Check this tool for any security issues, especially:
- Exposed credentials
- Input validation
- Error handling
- Data storage safety
```

**1:15-1:20 - Deploy Your Monitor (5 min)**
- Option A: Run locally with daily manual check
- Option B: Deploy to Vercel/Netlify (free tier)
- Option C: Set up GitHub Actions for automation

**1:20-1:25 - Share & Tips (5 min)**
- Show 2-3 working monitors
- Share troubleshooting guide

---

## AI Assistant Instructions Card (Handout)

### 🤖 How to Direct Your AI Assistant

### Core Principles for Non-Coders

**1. Build Incrementally**
```
Bad: "Build me a complete monitoring system"
Good: "Start with a simple tool that checks one website. We'll add more features after it works."
```

**2. Test As You Go**

After each feature, say:
```
"Show me how to test that this works"
"What could go wrong with this feature?"
"Add error handling for when the website is down"
```

**3. Security First**

Always include in your prompts:
```
"Never put passwords or API keys directly in the code"
"Validate all user inputs"
"Handle errors gracefully - don't crash"
```

**4. Clear Communication**

Be specific about what you want:
```
Bad: "Make it better"
Good: "Make the results table easier to read by adding borders and alternating row colors"
```

### Magic Phrases That Help

**When something breaks:**
```
"The tool shows this error: [paste error]. Please fix it and explain what went wrong in simple terms."
```

**For better code:**
```
"Make this more reliable by adding error handling"
"Add comments explaining what each section does"
"Make sure this works even if the website changes slightly"
```

**For testing:**
```
"How do I test that this works correctly?"
"What should I check to make sure it's working?"
"Add a test mode that uses sample data"
```

### Using /security-review in Windsurf/Cursor

After building your tool, ALWAYS run a security check:

```
/security-review

Please check for:
1. Any exposed passwords or API keys
2. Proper input validation
3. Safe data storage
4. Error handling
5. Any security vulnerabilities

Explain any issues in simple terms and fix them.
```

### Red Flags to Watch For

If the AI suggests any of these, ask it to find a safer way:
- Putting passwords in the code
- Skipping error handling ("we'll add that later")
- Using eval() or similar dangerous functions
- Storing sensitive data in plain text
- Making assumptions about input data

### Building Checklist

**Before each new feature:**
- [ ] Current version works
- [ ] You understand what you're adding
- [ ] You know how to test it

**After each new feature:**
- [ ] Test it works
- [ ] Check for errors
- [ ] Save your progress

**Before deploying:**
- [ ] Run /security-review
- [ ] Test with real data
- [ ] Test with bad/missing data
- [ ] Check it fails gracefully

---

## Sample Development Dialogue

Here's how a good conversation with your AI assistant looks:

**You:** "Build a tool that monitors the mayor's press releases on nola.gov"

**AI:** "I'll build a monitoring tool. Let me start simple..."

**You:** "Great. After you build the basic version, show me how to test it."

**AI:** [builds code]

**You:** "Now add keyword highlighting for 'budget', 'crime', and 'development'. But test the current version works first."

**AI:** [tests, then adds feature]

**You:** "The highlighting works! Now make it save the results so I can see what changed tomorrow. Remember to handle errors if storage fails."

**AI:** [adds storage with error handling]

**You:** "/security-review - check this is safe to use"

**AI:** [reviews and fixes any issues]

## Why This Approach Works

1. **Small Steps**: Each feature is tested before moving on
2. **Safety Built In**: Security considered at each step
3. **You Stay in Control**: You understand what's being built
4. **Failures Are Caught Early**: Problems are fixed immediately
5. **The Tool Is Maintainable**: Clear code you can modify later

## Workshop Success Metrics

Participants leave with:
1. A working monitor for their beat
2. Ability to safely direct AI assistants
3. Understanding of incremental development
4. Security awareness for AI-built tools
5. Confidence to build more tools

## Materials to Create

1. **workshop-guide.md** - Facilitator's detailed guide
2. **ai-instructions-card.pdf** - Laminated handout of AI instructions
3. **security-checklist.md** - Simple security review points
4. **sample-dialogue.md** - Full example conversations
5. **troubleshooting-guide.md** - Common issues and fixes
6. **starter-prompts/** - Directory of tested, working prompts

This plan ensures journalists can safely and effectively direct AI to build real, working tools while maintaining security and quality standards.