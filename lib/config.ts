export const config = {
  app: {
    name: "Med Spa Virtual Receptionist",
    description: "24/7 Virtual Receptionist for Med Spas",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    prices: {
      full: process.env.NEXT_PUBLIC_STRIPE_PRICE_FULL || '',
      subscription: process.env.NEXT_PUBLIC_STRIPE_PRICE_SUBSCRIPTION || '',
      pilot: process.env.NEXT_PUBLIC_STRIPE_PRICE_PILOT || '',
    },
  },

  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  email: {
    resendApiKey: process.env.RESEND_API_KEY || '',
  },

  analytics: {
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    gaTrackingId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },

  pricing: {
    full: {
      setupFee: 997,
      monthlyFee: 97,
      currency: "USD",
    },
    pilot: {
      price: 297,
      currency: "USD",
      duration: 14, // days
    },
  },

  avatar: {
    videos: {
      idle: "/videos/idle.mp4",
      listening: "/videos/listening.mp4", 
      talking: {
        neutral: "/videos/talking_neutral.mp4",
        animated: "/videos/talking_animated.mp4",
        empathetic: "/videos/talking_empathetic.mp4",
      },
      welcome: "/videos/welcome.mp4",
      pointing: "/videos/pointing.mp4",
    },
  },

  medSpa: {
    services: ["Botox", "Fillers", "Laser hair removal", "Facials", "Other"],
    leadVolume: ["<20 leads/mo", "20–50", "50–100", "100+"],
    urgency: ["This week", "Next 2 weeks", "Next month", "Just exploring"],
    cities: ["Miami", "LA", "Dallas", "NYC"],
  },

  tts: {
    elevenLabsApiKey: process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
    // Voice IDs for different emotions/contexts
    voices: {
      default: '21m00Tcm4TlvDq8ikWAM',    // Rachel - warm, conversational
      friendly: 'EXAVITQu4vr4xnSDxMaL',   // Bella - young, friendly
      professional: 'MF3mGyEYCl7XYWbV9V6O', // Elli - calm, professional
      empathetic: 'piTKgcLEGmPE4e6mEKli',  // Nicole - mature, trustworthy
    },
    model: 'eleven_turbo_v2_5', // Fast model with good quality
  },
};