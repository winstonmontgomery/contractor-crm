# Facebook Group Scraping Cron Job

## Overview
Automated hourly scraping of Contractor Verified Austin Facebook group to capture leads and contractor prospects.

## Cron Schedule

```bash
# OpenClaw cron job - run hourly 7am-9pm CT
openclaw cron add \
  --schedule "0 7-21 * * *" \
  --label "fb-group-scrape" \
  --task "Scrape Contractor Verified Austin FB group for new leads and contractor posts. Login as Lauren Garza. Capture: 1) Homeowner posts asking for contractor recommendations (save as leads with service needed, location, urgency). 2) Contractor posts promoting services (save as prospects with business name, services, contact info). Skip posts older than 1 hour. Insert into cv.db. Flag high-urgency leads for immediate outreach. Report summary of new leads/prospects captured."
```

## Alternative: HEARTBEAT.md Integration

Add to HEARTBEAT.md for polling during active hours:

```markdown
## FB Group Scraping (hourly 7am-9pm)
- [ ] Check Contractor Verified Austin FB group for new posts
- [ ] Capture homeowner "looking for" posts as leads
- [ ] Capture contractor promo posts as prospects
- [ ] Flag urgent leads (same-day needs, emergencies)
- [ ] Update cv.db with new entries
```

## Scraping Logic

### Step 1: Navigate to Group
```
https://www.facebook.com/groups/contractorverifiedaustin
```

### Step 2: Filter Recent Posts
- Only scrape posts from last 1-2 hours
- Skip pinned posts (already processed)
- Skip posts by admins/moderators

### Step 3: Classify Posts

**LEAD indicators:**
- "looking for"
- "need a"
- "recommend"
- "ISO"
- "anyone know"
- "help"
- Service keywords + question mark

**PROSPECT indicators:**
- Business name mentioned
- "I do" / "we offer"
- Phone number in post
- "DM for quote"
- Before/after photos
- Price mention

### Step 4: Extract Data

**Lead fields:**
- name (from FB profile)
- facebook_url
- service_needed (parsed from post)
- location (if mentioned)
- urgency (hot/warm/cold)
- post_url
- post_text (first 500 chars)
- posted_at

**Prospect fields:**
- name (business or owner)
- facebook_url
- services (parsed)
- phone (if present)
- website (if present)
- post_url
- source = 'facebook'

### Step 5: Dedupe & Insert
- Check for existing leads by name + service
- Check for existing prospects by phone or business name
- Insert new records only
- Update existing records with new data

### Step 6: Alert on Urgency

**High urgency triggers:**
- "emergency"
- "ASAP"
- "today"
- "urgent"
- "broken"
- "flooding"
- "no AC" / "no heat"

**Action:** Send Telegram alert to CJ for immediate outreach

## Expected Output

Daily summary (sent at 9pm):
```
📊 FB Scrape Summary - [date]

New Leads: 12
- HVAC: 4
- Plumbing: 3
- Electrical: 2
- Roofing: 2
- Other: 1

New Prospects: 5
- General Contractor: 2
- Painter: 1
- Landscaping: 1
- Handyman: 1

🔥 Hot Leads (urgent): 3
```

## Error Handling

- If FB login fails: Alert CJ, skip cycle
- If group access denied: Alert CJ immediately
- If rate limited: Back off 30 min, retry
- If post parsing fails: Log error, continue with others

## Dependencies

- OpenClaw browser automation
- Lauren Garza FB account access
- cv.db database
- Telegram notifications enabled
