// Demo configuration for guided 20-second experience

interface VideoTransition {
  enter: string;
  speak: string;
  exit: string;
}

interface Chip {
  id: string;
  label: string;
  primary?: boolean;
}

interface IdlePreview {
  id: string;
  tag: string;
  afterMs: number;
  previewEvent: string;
}

interface AudioConfig {
  prompt: string;
  preview: string;
}

interface CTAConfig {
  primary: { id: string; label: string };
  secondary: { id: string; label: string };
  subline: string;
}

export interface DemoStep {
  id: string;
  progress?: string;
  video?: VideoTransition | string;
  bubble: string;
  chips?: Chip[];
  idlePreview?: IdlePreview;
  storeOnTap?: string;
  next?: string;
  typingMs?: number;
  cards?: Array<{
    type: 'dm' | 'badge';
    text: string;
  }>;
  recap?: string;
  revealCTAs?: boolean;
  enableFreeChat?: boolean;
  links?: string[];
  suggestionChips?: string[];
  audio?: string | string[] | AudioConfig;
}

export interface DemoConfig {
  autostartMs: number;
  typingMs: number;
  steps: DemoStep[];
  ctas: CTAConfig;
  events: string[];
}

export const demoConfig: DemoConfig = {
  autostartMs: 2000,          // auto-run after 2s idle
  typingMs: 450,
  steps: [
    {
      id: "greet",
      progress: "Step 1 of 3",
      video: { enter: "listening", speak: "talking_neutral", exit: "listening" },
      bubble: "Hi—I'm Sarah, your virtual receptionist. Want to see me book an after-hours consult?",
      chips: [{ id: "start", label: "See it book in 20s", primary: true }],
      next: "service",
      audio: "greeting"
    },
    {
      id: "service",
      progress: "Step 1 of 3",
      video: { enter: "listening", speak: "talking_neutral", exit: "listening" },
      bubble: "Pick a service to demo.",
      chips: [
        { id: "botox",   label: "Botox" },
        { id: "fillers", label: "Fillers" },
        { id: "laser",   label: "Laser" },
        { id: "facials", label: "Facials" },
        { id: "other",   label: "Other" }
      ],
      // idle preview instead of autoSelect
      idlePreview: { id: "botox", tag: "(example)", afterMs: 1800, previewEvent: "demo_preview_service" },
      storeOnTap: "service",     // persist only on real tap
      next: "volume",
      audio: { prompt: "prompt_service", preview: "idle_service_example" }
    },
    {
      id: "volume",
      progress: "Step 2 of 3",
      video: { enter: "listening", speak: "talking_neutral", exit: "listening" },
      bubble: "How many new leads per month right now?",
      chips: [
        { id: "lt20",  label: "<20" },
        { id: "20_50", label: "20–50" },
        { id: "50_100",label: "50–100" },
        { id: "100p",  label: "100+" }
      ],
      idlePreview: { id: "20_50", tag: "(example)", afterMs: 1800, previewEvent: "demo_preview_volume" },
      storeOnTap: "volume",
      next: "booking",
      audio: { prompt: "prompt_volume", preview: "idle_volume_example" }
    },
    {
      id: "booking",
      progress: "Step 3 of 3",
      video: { enter: "ack_nod", speak: "talking_neutral", exit: "listening" },
      bubble: "Great, now let's find the perfect slot.",
      typingMs: 450,
      cards: [
        { type: "dm",    text: "Hi, thanks for reaching out about {service}. I can book you {day} {time}. Does that work?" },
        { type: "dm",    text: "Great—you're booked. A confirmation is on the way." },
        { type: "badge", text: "Added to Google Calendar" },
        { type: "badge", text: "SMS alert sent" }
      ],
      recap: "I answer in seconds, qualify, and book—24/7.",
      revealCTAs: true,          // only here
      next: "handoff",
      audio: ["narration_1147pm", "dm_offer_slot", "dm_booked_confirm", "recap_247"]
    },
    {
      id: "handoff",
      bubble: "Want me live this week?",
      links: ["Replay 20-sec demo ↺", "See pricing"],
      enableFreeChat: true,
      suggestionChips: ["Pricing", "Setup in 72h?", "Works with Calendly?"],
      audio: "cta_try_pilot"
    }
  ],
  ctas: {
    primary: { id: "pilot", label: "Start 14-Day Pilot ($297)" },
    secondary:{ id: "full",  label: "Book Full Setup" },
    subline:  "Live in 72 hours on a branded page · Optional website embed"
  },
  events: [
    "hero_view","demo_start","demo_service","demo_volume",
    "demo_booking_shown","cta_viewed","cta_click_pilot","cta_click_full",
    "demo_preview_service","demo_preview_volume","demo_replay","freechat_opened"
  ]
};

export function getDemoStep(stepId: string): DemoStep | undefined {
  return demoConfig.steps.find(step => step.id === stepId);
}

export function getNextStep(currentStepId: string): DemoStep | undefined {
  const currentStep = getDemoStep(currentStepId);
  if (!currentStep?.next) return undefined;
  return getDemoStep(currentStep.next);
}
