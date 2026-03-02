# Facebook Group Moderator Playbook
## Contractor Verified Austin (63K members)

---

## 🎯 Goals

1. **Capture every lead** — homeowners asking for contractor recs
2. **Recruit quality contractors** — identify active, well-reviewed pros
3. **Control the narrative** — position Contractor Verified as THE trusted source
4. **Drive traffic to platform** — push people to contractorverified.com

---

## 🤖 Hourly Cron Job: Lead Scraping

### What to Scrape
Every hour, scan the group for:

1. **Homeowner posts** (LEADS):
   - "Looking for a..."
   - "Need recommendations for..."
   - "Anyone know a good..."
   - "ISO" (in search of)
   - "Help! Need a..."
   - Service keywords: plumber, electrician, HVAC, roofer, painter, etc.

2. **Contractor posts** (PROSPECTS):
   - "I do [service]..."
   - "We specialize in..."
   - Business name + phone/website
   - Before/after photos
   - "DM for quote"

### Data to Capture

**For Leads:**
- Poster name + FB profile URL
- Service needed
- Location (if mentioned)
- Urgency indicators
- Phone (if posted)
- Post timestamp
- Post URL

**For Contractors:**
- Business name
- Owner name + FB profile
- Services mentioned
- Phone/website (if posted)
- Photo quality (indicator of professionalism)
- Engagement on post

### Cron Schedule
```
# Run every hour during business hours (7am-9pm CT)
0 7-21 * * * /path/to/fb-scrape.js
```

### Output
- Insert leads into `leads` table
- Insert contractors into `prospects` table with source='facebook'
- Flag duplicates (by phone or name)
- Generate daily summary for CJ

---

## 👷 Moderator Response Playbook

### When a Homeowner Posts Looking for a Contractor

**FAST RESPONSE (within 15 min ideal):**

> "Great question! We actually maintain a list of verified contractors for [service] in Austin. I'll DM you a few trusted recommendations. 
> 
> Pro tip: Always ask for proof of insurance and check reviews before hiring. 🏆"

**Then DM them:**
> "Hey [name]! Here are 3 verified [service] contractors from our directory:
> 
> 1. [Company] - [phone] - ⭐ 4.9 rating
> 2. [Company] - [phone] - ⭐ 4.8 rating  
> 3. [Company] - [phone] - ⭐ 4.7 rating
>
> All are verified (insurance + license checked). You can see their full profiles at contractorverified.com
>
> Let me know who you go with — I love hearing success stories!"

**WHY THIS WORKS:**
- Positions us as the authority
- Drives traffic to our platform
- Creates obligation (reciprocity)
- Captures lead data

---

### When a Contractor Posts Promoting Services

**If they're NOT verified yet:**

> "Nice work! 🔨 Have you gotten verified with Contractor Verified yet? It's free and gets you a badge + featured to our 63K members. DM me if interested!"

**If they ARE verified:**

> "Great to see [Company] in action! ✓ Verified Contractor 🏆 
> Check out their full profile: contractorverified.com/c/[slug]"

**WHY THIS WORKS:**
- Soft recruitment pitch
- Shows verification has value
- Drives traffic to contractor profiles

---

### When Someone Complains About a Contractor

**Public response:**

> "Sorry to hear that! This is exactly why we created the verification program — to help homeowners find contractors they can trust.
>
> A few tips for next time:
> 1. Check if they're verified (look for the ✓ badge)
> 2. Ask for proof of insurance before work starts
> 3. Get everything in writing
>
> If you need help finding a replacement, DM me and I'll send some trusted options."

**WHY THIS WORKS:**
- Positions verification as the solution
- Captures a warm lead
- Builds trust in the brand

---

### Engagement Tactics

**Daily:**
- Like/react to 10-20 posts
- Comment helpfully on 5-10 posts
- Welcome new members
- Pin important verification-related posts

**Weekly:**
- Feature a "Verified Contractor Spotlight" post
- Share a success story (homeowner + contractor)
- Post tips for hiring contractors
- Remind members about verification benefits

**Monthly:**
- Host a Q&A or live
- Run a "Get Verified" promotion
- Purge spam accounts
- Review group rules and update

---

## 📊 Metrics to Track

| Metric | Target |
|--------|--------|
| Leads captured/day | 10+ |
| Contractors recruited/week | 5+ |
| Response time to posts | <15 min |
| DM conversion rate | 30%+ |
| Platform signups/week | 10+ |

---

## 🚨 Red Flags to Watch

1. **Competitors** — other contractor directories trying to poach
2. **Scammers** — fake contractors, too-good-to-be-true offers
3. **Drama** — contractor disputes, negative callouts
4. **Spam** — MLM, off-topic posts, bots

**Action:** Remove + ban repeat offenders. Document everything.

---

## 🔑 Key Moderator Accounts

- **Lauren Garza** — current moderator account
- Back up accounts: [TBD]

---

## 📱 Notification Setup

Turn ON notifications for:
- New posts (for fast response)
- Keyword mentions: "plumber", "electrician", "HVAC", "roofer", "contractor", "recommendation", "ISO"
- DMs

---

## 🎯 The Endgame

Every interaction should:
1. **Capture data** (lead or contractor)
2. **Build trust** in Contractor Verified brand
3. **Drive traffic** to contractorverified.com
4. **Position us** as the authority on Austin contractors

We're not just moderating — we're building a lead machine.
