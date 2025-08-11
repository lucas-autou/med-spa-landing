# Business Rules & Requirements

## Direction & Positioning

### Mission
Stop U.S. med spas from losing money to missed calls. Sarah answers, qualifies, and books 24/7.

### Category
AI receptionist + done-for-you implementation (service + software)

### Core Promise
"Never miss a booking again. Go live in 48-72 hours."

---

## ICP (Ideal Customer Profile)

### Primary Target
- **Business Type**: U.S. med spas
- **Size**: 80-400 appointments/month
- **Structure**: Owner-led or small team
- **Current Tools**: Vagaro/Mindbody/Calendly/Google Calendar

### Pain Signals to Target
- Missed calls after hours
- Front desk overload
- Slow response to inquiries
- High no-show rates
- Inconsistent phone scripts

### Exclusions (Do Not Target)
- Chain clinics requiring custom IT integrations
- Hospitals with PHI-heavy workflows (without BAA)
- Non-U.S. clinics (for initial launch)

---

## Offer & Pricing Structure

### 🎯 Hero SKU: 14-Day Pilot
- **Price**: $297 one-time
- **Includes**: 
  - Full setup and configuration
  - Real lead handling
  - Keep all leads generated
  - 100% credit toward upgrade
- **Guarantee**: "Try for 14 days—keep all leads or get 100% back"

### Monthly Subscription
- **Price**: $199/month
- **Start**: After pilot ends or full setup complete
- **Terms**: Cancel anytime, no contracts

### Optional: Full Setup (Secondary)
- **Price**: $997 one-time (skip pilot)
- **Positioning**: Quiet secondary option only
- **Use Case**: Buyers ready to commit immediately

### Go-Live Promise
48-72 hours from intake completion

---

## Product Scope (MVP Requirements)

### ✅ Must Have (Every Time)

#### Multi-Channel Entry
- Web link (primary)
- SMS support
- WhatsApp (optional, phase 2)

#### Core Conversation Flows
1. Greet visitors warmly
2. Qualify needs and preferences
3. Answer pricing FAQs
4. Show available slots
5. Book to existing system (Vagaro/Mindbody/Calendly/Google Cal)

#### Smart Features
- Automated reminders via link/SMS
- Reschedule handling
- Owner dashboard (basic):
  - Daily/weekly bookings count
  - Leads handled
  - Response time metrics

#### Safety Nets
- Human handoff for edge cases
- "I'll have our team text you right away"
- No-code content controls (services, prices, policies)
- Complete conversation logging

### ❌ Won't Ship (V1 Focus)
- Custom EMR/PM integrations beyond listed tools
- Multi-location routing logic
- Voice call handling (text-first at launch)
- Complex medical record access

---

## Funnel Rules

### Traffic Sources
- **Primary**: Instagram & Facebook video ads featuring Sarah
- **Secondary**: Organic social proof, referrals

### Landing Page Hero
- **Main Action**: Live demo experience
- **CTA**: "See how the pilot works"
- **Mechanism**: Slide-over modal (feature-unlock tone, not hard sell)

### Slide-Over Modal Rules
- **Display**: Pilot card prominently
- **Secondary**: Full setup as small link
- **Disclosure**: Monthly fee in fine print
- **Persistence**: If ignored, Sarah continues conversation
- **Re-engagement**: Re-invite after 2-3 conversation turns

### Mobile Experience
- Sticky CTA visible at all times
- Optimized for thumb reach
- Simplified navigation

---

## Onboarding Playbook (48-72 Hours)

### Day 0: Purchase
1. Checkout completion ($297)
2. Auto-send intake form:
   - Services offered
   - Pricing structure
   - Business hours
   - Calendar system link
   - Policies and procedures

### Day 1: Configuration
1. Optional 30-min onboarding call
   - Confirm voice and tone preferences
   - Review and approve scripts
2. Technical setup begins

### Day 2: Testing
1. Build and connect systems
   - Calendar integration
   - FAQ database
   - Custom scripts
2. Internal QA (10 flows minimum):
   - Pricing inquiries
   - Availability checks
   - Reschedule requests
   - Deposit and policy questions

### Day 3: Launch
1. Go-live confirmation
2. Daily monitoring begins
3. First booking celebration

### Days 4-14: Optimization
- Daily checks for first 7 days
- Weekly summary emails
- Performance tuning
- Upgrade path introduction

---

## Support & SLAs

### Response Times
- **Standard**: Same business day (PT/ET)
- **Priority**: During first 7 days after go-live
- **Critical Issues**: Within 24 hours

### Fix Timelines
- **Booking Failures**: Within 24 hours
- **Content Edits**: Within 1 business day
- **Feature Requests**: Logged for next sprint

### Reporting
Weekly email including:
- New leads generated
- Bookings completed
- Average response time
- Show rate metrics

---

## Compliance, Privacy & Claims

### HIPAA Positioning
- **Market as**: "HIPAA-ready" (not "HIPAA-compliant")
- **Full Compliance**: Only after signed BAA + controls
- **Pilot Demo**: No PHI collection
- **UI Notice**: "No patient data stored"

### Data Handling
- **Storage**: Lead/contact/booking essentials only
- **SMS Compliance**: TCPA adherence
  - STOP command handling
  - HELP command support
  - Opt-out honored immediately

### Security Requirements
- Least privilege access model
- Complete audit logging
- Regular key rotation
- No training on customer conversations without explicit consent

### Claims & Marketing
- All numbers must be defensible
- Use ranges only with proof ("+40% more leads")
- Include disclaimers where appropriate

---

## AI Guardrails

### Conversation Management
- **Booking/FAQ**: Use deterministic scripts
- **Natural Language**: Allow only where safe
- **Sensitive Topics**: Deflect medical advice → "Please consult your provider"

### Safety Checks
- Validate free-text before API calls
- Confirm slot/time/policy before booking
- Require explicit confirmation for commitments
- Log all decision points

### Error Handling
- Graceful fallbacks for AI failures
- Human handoff for complex cases
- Clear error messages to users

---

## Brand & Voice Guidelines

### Tone Requirements
- Calm and professional
- Competent and knowledgeable
- Friendly but not overly casual
- U.S. med-spa vernacular

### Writing Style
- Short, clear sentences
- No medical jargon
- No hype or overselling
- Action-oriented language

### Design Principles
- Clean and premium aesthetic
- Minimal visual clutter
- Strong contrast on CTAs
- Mobile-first approach

---

## Metrics That Matter

### Conversion Funnel
| Stage | Metric | Target |
|-------|--------|--------|
| Top | Demo starts | >60% |
| Mid | Slide-over opens | >40% |
| Mid | Pilot CTA clicks | >25% |
| Bottom | Purchases | >8% |

### Activation Metrics
- Time to go-live: ≤72h for 95% of clients
- First booking: Within 48h of go-live
- Daily active usage: >80% of clients

### Business Impact
- Bookings created per client per week
- Average response time (<5 seconds)
- Show rate improvement
- MRR per client ($199 target)

### Risk Monitoring
- No-booking days (alert threshold: 2)
- Owner edits pending (alert threshold: 24h)
- Negative feedback (immediate escalation)
- Churn signals (low engagement)

### Testing Cadence
- Maximum 2 A/B tests running simultaneously
- Minimum 14-day test duration
- Statistical significance required

---

## Sales & Lifecycle Management

### Post-Purchase Sequence (14 Days)

| Day | Action | Message |
|-----|--------|---------|
| 0 | Welcome | Payment receipt + intake form + scheduler |
| 1-3 | Updates | Build progress notifications |
| 7 | Results | Performance snapshot + tips |
| 12 | Upgrade | "Apply your $297 credit now" |
| 14 | Final | Last reminder for credit |

### Reactivation Triggers
- **Day 5**: If pilot inactive → Call/text to unblock
- **Day 7**: If no bookings → Optimization consultation
- **Day 10**: If low engagement → Script adjustment

### Monthly Lifecycle
- **Week 1**: Onboarding and optimization
- **Week 2**: Performance review
- **Week 3**: Feature utilization check
- **Week 4**: Renewal and upsell opportunity

---

## Refunds, Cancellations & Billing

### Pilot Refund Policy
- Available within 14 days
- No questions asked
- Process within 3-5 business days

### Monthly Billing
- $199 charged after go-live
- First month prorated if needed
- Auto-renewal unless cancelled

### Cancellation Terms
- Cancel anytime via dashboard
- Billing stops immediately
- Access ends at period close
- Data export available

### Chargeback Prevention
- Clear email receipts
- Signed intake forms
- Complete activity logs
- Documented communications

---

## Decision Principles

### When Unsure, Apply These Rules:

1. **Clarity beats cleverness**
   - Simplify if causing friction
   - Remove confusing steps

2. **Demo > description**
   - Show Sarah working first
   - Explain features second

3. **One primary choice**
   - Pilot is the hero
   - Full setup stays quiet

4. **Ship small, verify, then widen**
   - Protect speed and quality
   - Validate with real users

5. **U.S. market first**
   - All copy for U.S. audience
   - Support in PT/ET hours
   - U.S. compliance only

---

## Implementation Checklist

### Pre-Launch
- [ ] Pricing updated to $297/$199
- [ ] "HIPAA-ready" language (not "compliant")
- [ ] 48-72 hour promise prominent
- [ ] Pilot as hero offer
- [ ] Full setup minimized

### Launch Ready
- [ ] Intake form automated
- [ ] SMS channel configured
- [ ] Dashboard functional
- [ ] QA checklist complete
- [ ] Support team trained

### Post-Launch
- [ ] Daily monitoring active
- [ ] Weekly reports scheduled
- [ ] Upgrade paths configured
- [ ] Reactivation triggers set
- [ ] A/B tests planned

---

## Escalation Matrix

| Issue Type | Response Time | Escalation Path |
|------------|---------------|-----------------|
| Booking failure | <2 hours | Tech lead → CTO |
| Payment issue | <4 hours | Support → Finance |
| Negative feedback | <1 hour | Support → Customer Success → CEO |
| Technical bug | <24 hours | Support → Engineering |
| Feature request | <48 hours | Support → Product |

---

## Version Control

- **Version**: 1.0.0
- **Last Updated**: January 2025
- **Review Cycle**: Weekly during pilot, monthly after
- **Owner**: Product Team
- **Approval**: CEO required for pricing/positioning changes

---

*This document represents the single source of truth for all business decisions. Any deviations require written approval from leadership.*