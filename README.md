# Your Entire Dev Team, Automated

Stop context-switching between roles. Stop waiting for code reviews. Stop managing mundane tickets.

**Cielo Red is your complete AI development team** - from project management to deployment, all working autonomously in your GitHub workflows.

---

## 🚀 Ready to 10x Your Team Right Now?

```bash
curl -fsSL https://raw.githubusercontent.com/cielo-red/agent/main/install.sh | bash
```

**30 seconds to install. 10x productivity forever.** [↓ Skip to install instructions](#get-started-in-30-seconds)

💡 **Works with your existing plan** - Corporate Anthropic accounts, Claude Pro/Team subscriptions, or pay-per-use API

## What's Missing? All the Stuff You Hate

### 🚫 No Sign-Ups or Account Creation
**Zero friction onboarding.** Uses your existing GitHub account and repository permissions. No forms to fill out, no email verification, no password to remember. If you can push code, you can use Cielo Red. Authentication flows through GitHub's existing systems you already trust.

### 💳 No Credit Cards or New Subscriptions  
**Zero additional billing.** Works with your existing Anthropic API key or Claude subscription. Whether you're on Claude Pro, Team, or using corporate Anthropic accounts - just plug in what you already have. No surprise charges, no usage meters to monitor, no procurement headaches.

### 📞 No Sales Calls or "Book a Demo"
**Zero sales pressure.** Install with one curl command and start using immediately. No qualifying questions, no "let's schedule a call," no feature demos you'll forget. The installer is the demo. The code is the documentation. Try it now, not next week after a meeting.

### 🎭 No Vendor Demos or Proof-of-Concepts
**Zero evaluation theater.** It's open source - read the code yourself instead of watching someone click through slides. Fork it, modify it, audit it. The source code on GitHub is more honest than any sales presentation could ever be.

### 🔒 No Vendor Lock-In or Proprietary Formats
**Zero switching costs.** Built on standard GitHub Actions that you can remove, modify, or replace anytime. Your workflows remain yours. Your prompts are plain markdown files. Your data never leaves your repository. Exit strategy is `git rm` and you're done.

### 🕵️ No Data Collection or External Services
**Zero privacy concerns.** Runs entirely in your GitHub Actions environment using your own compute and API keys. We never see your code, issues, or conversations. No analytics dashboards tracking your usage, no "telemetry" phone-home features.

### 📚 No Learning Curve or Training Required
**Zero onboarding overhead.** Comment `@cielo fix this bug` just like you would mention any teammate. No special syntax, no custom commands, no configuration files to learn. If you can write a GitHub comment, you can manage an AI development team.

---

## Why Settle for One AI When You Can Have a Whole Team?

**Traditional approach:** One AI assistant doing everything poorly  
**Cielo Red approach:** Specialized AI agents for every role, working together seamlessly

### 🏆 Ship Faster, Sleep Better

- **No more bottlenecks**: Multiple specialists working in parallel, not serial
- **24/7 development**: Your team never stops working, even when you do
- **Zero onboarding**: New team members that know your codebase instantly
- **Consistent quality**: No off days, no rushed reviews, no human error

### 💰 The Economics Are Obvious

- Replace expensive consultants with AI specialists
- Scale your team without hiring headaches
- Reduce time-to-market from months to days
- Free your humans for creative work, not tedious tasks

### 🧠 Intelligence That Actually Scales

Each role has its own expertise:
- **Manager**: Breaks down epics, creates tickets, manages priorities
- **Developer**: Writes code, implements features, fixes bugs
- **Architect**: Designs systems, enforces patterns, prevents technical debt
- **Security**: Finds vulnerabilities, enforces policies, secures deployments
- **QA**: Writes tests, validates features, catches edge cases
- **DevOps**: Manages infrastructure, optimizes CI/CD, monitors performance

## How It Actually Works

### 1. Intelligent Role Assignment
```yaml
# Your workflow becomes this simple
- uses: cielo-red/agent@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    # That's it. The system figures out who should work on what.
```

### 2. Self-Organizing Teams
- **New role needed?** AI generates expert prompts automatically
- **Custom expertise?** Override with your own `.cielo/agents/role.md` files
- **Multiple specialists?** They work in parallel, not conflict

### 3. Zero Configuration Required
```yaml
name: Complete SDLC Team

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  # Each role runs independently, in parallel
  manager: { uses: cielo-red/agent@v1 }
  developer: { uses: cielo-red/agent@v1 }
  security: { uses: cielo-red/agent@v1 }
  qa: { uses: cielo-red/agent@v1 }
  # Add any role you need - the system adapts
```

## Stop Doing Work Machines Should Do

### Before Cielo Red:
- 🕐 Wait for senior dev review → **2-3 days**
- 🕑 Security review meeting → **1 week**  
- 🕒 QA testing cycle → **3-5 days**
- 🕓 Architecture approval → **1-2 weeks**

### With Cielo Red:
- ⚡ All reviews complete → **Minutes**
- ⚡ Security analysis → **Automatic**
- ⚡ Tests written & run → **Immediate**
- ⚡ Architecture validated → **Real-time**

## The Proof Is In Production

**For Startups**: Get enterprise-level processes without enterprise headcount  
**For Scale-ups**: Maintain quality while moving fast  
**For Enterprises**: Reduce cycle time from quarters to sprints  

### Real Impact:
- **10x faster code reviews** (senior devs focus on architecture, not syntax)
- **Zero missed security issues** (every line gets expert security analysis)
- **100% test coverage** (QA agent writes comprehensive tests automatically)
- **Perfect documentation** (technical writer keeps everything updated)

## Get Started in 30 Seconds

### The One-Liner That Changes Everything
```bash
# Install the full AI development team
curl -fsSL https://raw.githubusercontent.com/cielo-red/agent/main/install.sh | bash

# Or just the basic workflow
curl -fsSL https://raw.githubusercontent.com/cielo-red/agent/main/install.sh | bash -s -- --basic
```

That's it. The installer:
- ✅ Sets up workflows automatically
- ✅ Configures authentication (with GitHub CLI)
- ✅ Creates agent directory structure
- ✅ Guides you through next steps

### Manual Setup (If You Prefer)
```yaml
# Add this to .github/workflows/cielo.yml
- uses: cielo-red/agent@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Why Every Smart Team Is Making This Switch

**Stop hiring for roles AI can fill perfectly**  
**Stop waiting for humans to do machine work**  
**Stop sacrificing quality for speed**

Your competition is already using AI teams. The question isn't whether to adopt this - it's whether you'll lead or follow.

---

**Ready to 10x your development velocity?**

[See the full team in action →](.github/workflows/team.yml) | [Join 1000+ teams already shipping faster →](https://github.com/cielo-red/agent/stargazers)

*Built by developers, for developers who refuse to work slower than their machines.*