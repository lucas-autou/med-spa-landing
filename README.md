# Med Spa Virtual Assistant Landing Page

A high-converting Next.js landing page featuring a Virtual Receptionist (avatar + bot), smart qualification system, and direct Stripe checkout for Med Spas.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## ✨ Features

### 🎭 Interactive Avatar Widget
- Animated avatar with multiple states (idle, listening, talking)
- Smart qualification flow with interactive chips
- Tone classification for realistic responses
- Graceful fallback to placeholder if videos unavailable

### 💳 Complete Checkout System
- Stripe integration for both plans
- Demo mode for development testing
- Thank you page with conversion tracking
- Onboarding form for new customers

### 📊 Analytics & Tracking
- Meta Pixel and GA4 integration
- 15+ custom events tracked
- Conversion tracking with revenue data
- Demo mode detection

### 🎨 Professional Design
- Dark theme with Med Spa color palette
- Responsive design (mobile-first)
- Interactive components with hover effects
- Accessibility features built-in

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API endpoints
│   ├── checkout-full/     # Full setup checkout
│   ├── checkout-pilot/    # Pilot program checkout
│   ├── thank-you/         # Post-checkout success
│   └── onboarding/        # Customer setup form
├── components/            # Reusable React components
├── lib/                   # Utilities and configuration
├── store/                 # Zustand state management
└── public/videos/         # Avatar video assets
```

## 🎮 Demo Mode

The app automatically runs in demo mode during development:

- **Checkout**: Simulates successful payments without Stripe
- **Avatar**: Uses animated placeholder instead of videos
- **Analytics**: Tracks events to console
- **Visual Indicator**: Yellow banner shows demo status

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Stripe (required for production)
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Analytics (optional)
NEXT_PUBLIC_META_PIXEL_ID=123...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
```

### Avatar Videos

Place video files in `public/videos/`:
- `idle.mp4` - Default state
- `listening.mp4` - When user speaks
- `talking_neutral.mp4` - Neutral responses
- `talking_animated.mp4` - Enthusiastic responses  
- `talking_empathetic.mp4` - Caring responses

## 📱 Pages & Flow

1. **Landing Page** (`/`) - Hero, features, pricing, FAQ
2. **Checkout** (`/checkout-full`, `/checkout-pilot`) - Payment processing
3. **Thank You** (`/thank-you`) - Post-payment confirmation
4. **Onboarding** (`/onboarding`) - Customer setup form

## 🎯 Key Interactions

### Avatar Conversation Flow
1. User clicks "Start Conversation"
2. Avatar asks about main service focus
3. Avatar asks about monthly lead volume
4. Avatar presents pricing options
5. User selects plan and proceeds to checkout

### Checkout Process
- **Demo Mode**: Simulates payment and redirects to thank you
- **Production**: Processes real Stripe payment
- **Thank You**: Shows next steps and onboarding link

## 🔨 Build Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

## 📈 Analytics Events

The app tracks these key events:
- `hero_view` - Landing page load
- `cta_click_hire_now` - Full setup CTA
- `cta_click_pilot` - Pilot program CTA
- `chip_selected` - Avatar conversation choices
- `checkout_success` - Successful payment
- `form_submitted` - Onboarding completion

## 🎨 Design System

- **Colors**: Dark theme with medical blue (#2D9CDB) and beauty pink (#FF8FA3)
- **Typography**: Inter and Poppins fonts
- **Components**: Consistent spacing, hover effects, and transitions
- **Responsive**: Mobile-first design with breakpoints

## 🚢 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
The app builds to a static export and works on any hosting platform.

## 📞 Support

- Email: support@medspareceptionist.com
- Demo issues: Check browser console for demo mode logs
- Build errors: Ensure all environment variables are set

---

Built with ❤️ for Med Spas using Next.js 14, TypeScript, and TailwindCSS.