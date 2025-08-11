# Med Spa Virtual Assistant Landing Page

## 🎯 Business Context

### Mission
Stop U.S. med spas from losing money to missed calls. Sarah answers, qualifies, and books 24/7.

### Target Customer (ICP)
- **Primary**: U.S. med spas doing 80-400 appts/mo
- **Tools**: Vagaro/Mindbody/Calendly/Google Calendar
- **Pain**: Missed calls, front desk overload, slow replies
- **Exclude**: Chains, hospitals without BAA, non-U.S.

### Pricing (LOCKED)
- **Hero**: 14-Day Pilot — $297 (100% credit toward upgrade)
- **Monthly**: $199/mo after pilot or full setup
- **Secondary**: Full Setup — $997 (quiet option only)
- **Guarantee**: Try 14 days, keep all leads or 100% refund

### Key Business Rules
- Go-live in 48-72 hours (not just 72)
- "HIPAA-ready" NOT "HIPAA-compliant" (until BAA)
- Pilot is primary offer, full setup secondary
- Demo > description (show Sarah working first)
- U.S. market only for now

## 🚨 Critical Implementation Priorities

### Must Fix Immediately
1. **Pricing**: Update from $997/$97 to $297 pilot / $199 monthly
2. **Language**: Change "HIPAA-compliant" to "HIPAA-ready"
3. **Timeline**: Update to "48-72 hours" messaging
4. **Hero Offer**: Make pilot prominent, minimize full setup

### Must Build (MVP)
1. **Owner Dashboard**: Basic metrics (bookings, leads, response time)
2. **SMS Channel**: Add SMS support alongside web
3. **Intake Automation**: Post-purchase form flow
4. **Weekly Reports**: Automated performance emails

### Won't Build (V1)
- No custom EMR integrations beyond listed tools
- No multi-location routing
- No voice calls (text-first)
- No PHI in pilot demo

## 💻 Technical Implementation

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + React + TypeScript + TailwindCSS
- **State Management**: React state + Zustand
- **Payments**: Stripe Checkout (setup fee + subscription; pilot one-time)
- **Email**: Resend for transactional emails
- **Database**: Supabase (customers, orders, leads, configs tables)
- **Analytics**: Meta Pixel + GA4 with custom events
- **Deployment**: Vercel

### Key Features
- 24/7 Virtual Receptionist avatar with video states (idle, listening, talking)
- Smart qualification using chips + voice input
- Automated onboarding flow post-checkout
- Med Spa presets (Botox, fillers, laser, facials)
- Real-time notifications and lead capture

### Development Commands
```bash
# Development
npm run dev

# Build and type check
npm run build
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Testing
npm run test
npm run test:watch
```

### Project Structure
```
/app
  /api/stripe/webhooks/route.ts
  /api/lead/route.ts
  /checkout-full/page.tsx
  /checkout-pilot/page.tsx
  /thank-you/page.tsx
  /onboarding/page.tsx
  /page.tsx  (landing)
/components
  AvatarWidget.tsx
  Chips.tsx
  CTAButtons.tsx
  FeatureCards.tsx
  PricingTable.tsx
  FAQ.tsx
/lib
  stripe.ts
  analytics.ts
  tone.ts
  config.ts
  db.ts
/store
  useAssistantStore.ts
/public/videos
  idle.mp4, listening.mp4, talking_*.mp4
/styles
  globals.css, tokens.css, tokens.json
```

## 🎨 Design System

### Light Theme (Primary)
- **Background**: Primary #FFFFFF, Secondary #FAFAF9, Tertiary #F5F5F3
- **Primary CTA**: Teal #14B8A6 with hover #10A395
- **Accent**: Blush #FFB5C5 (subtle highlights only)
- **Cards**: White background with subtle borders #E5E5E5 and soft shadows
- **Text**: Primary #1A1A1A, Secondary #4B4B4B, Tertiary #7A7A7A

### Avatar Widget States
- **idle**: Subtle breathing, soft smile (default)
- **listening**: Small nods during user speech
- **talking**: neutral/animated/empathetic based on tone
- Display format: 4:5 or 3:4 aspect ratio in rounded card

## 🔄 Conversion Flow

### Funnel Rules
1. **Traffic**: Instagram/FB video ads → Landing page
2. **Hero**: Live demo + "See how pilot works" → slide-over
3. **Slide-over**: Pilot card primary, full setup small link
4. **Persistence**: Sarah continues if ignored, re-invites after 2-3 turns
5. **Mobile**: Sticky CTA always visible

### Qualification Flow
1. Greet with avatar animation
2. Q1: Service type (Botox, Fillers, Laser, Facials, Other)
3. Q2: Monthly leads (<20, 20-50, 50-100, 100+)
4. Present CTAs based on qualification
5. Capture lead data and trigger checkout

## 📊 Database Schema
- **customers**: id, email, phone, business_name, website, created_at
- **orders**: id, customer_id, stripe_session_id, plan_type, status, amount
- **leads**: id, customer_id, business_type, monthly_leads_band, goal
- **configs**: customer_id, settings_json (avatar customizations)

## 🔐 Environment Variables
```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PRICE_FULL=
NEXT_PUBLIC_STRIPE_PRICE_SUBSCRIPTION=
NEXT_PUBLIC_STRIPE_PRICE_PILOT=
RESEND_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## ✅ Acceptance Criteria (MVP)
- Landing page LCP < 2.5s desktop
- Avatar transitions smooth (<400ms audio buffer)
- Keyboard/mouse chip selection with text fallback
- Working Stripe checkout for both plans
- Webhook-triggered onboarding emails
- Meta Pixel + GA4 events firing
- Vercel deployment ready

## 📝 Content Strategy
- **Hero H1**: "Never Miss a Booking at Your Med Spa"
- **Subheadline**: "Your 24/7 virtual receptionist — answering, qualifying, and booking clients even after hours."
- **Primary CTA**: "Start 14-Day Pilot"
- **Secondary CTA**: "Book Full Setup" (quiet)
- **Trust Line**: "Setup in 48-72 hours · Cancel anytime · HIPAA-ready lead capture"

## 🛡️ Security & Compliance
- Server-side Stripe keys only
- Webhook signature verification
- "HIPAA-ready" positioning (not "compliant" until BAA)
- GDPR/CCPA-friendly data handling
- Rate limiting on form endpoints
- Zod input validation

## 🎯 Decision Principles
1. **Clarity beats cleverness** - Simplify if causing friction
2. **Demo > description** - Show Sarah working first
3. **One primary choice** - Pilot is hero, full setup secondary
4. **Ship small, verify, widen** - Protect speed and quality
5. **U.S. market first** - All optimization for U.S. med spas

## 📚 Related Documentation
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Comprehensive project details
- [BUSINESS_RULES.md](./BUSINESS_RULES.md) - Strict business requirements

## 🚀 Next Steps After MVP
- Calendar integration (Google/Calendly direct)
- SMS notifications via Twilio
- Partner/white-label mode
- A/B testing framework
- Voice call support (phase 2)

---

# Important Instruction Reminders
- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary
- ALWAYS prefer editing existing files
- NEVER proactively create documentation unless requested
- Follow the business rules strictly - especially pricing and positioning