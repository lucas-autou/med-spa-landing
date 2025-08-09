# OpenAI API Setup Instructions

## 🚀 Quick Setup

1. **Get your OpenAI API Key:**
   - Visit: https://platform.openai.com/account/api-keys
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)

2. **Add to Environment:**
   - Open `.env.local` in your project root
   - Replace `your_openai_api_key_here` with your actual API key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

3. **Test the Integration:**
   - Save the file and restart your dev server: `npm run dev`
   - Go to your landing page
   - Try the "Enhanced Interactive Demo" section
   - Type complex questions like:
     - "What's the difference between Botox and fillers?"
     - "How long does Botox last and what are the side effects?"
     - "I'm interested in lip fillers but worried about pain"

## 🎯 How It Works

- **Smart Fallback**: Simple questions use fast rule-based responses
- **AI Power**: Complex questions automatically route to GPT-4o mini
- **Safety First**: Medical concerns are detected and referred to specialists
- **Context Aware**: AI remembers the conversation and provides relevant follow-ups

## 🔧 Configuration Options

The AI service is pre-configured with optimal settings:
- **Model**: GPT-4o mini (fast + cost-effective)
- **Max Tokens**: 150 (concise responses)
- **Temperature**: 0.7 (balanced creativity)

You can adjust these in `.env.local`:
```
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=150
OPENAI_TEMPERATURE=0.7
```

## 🎭 AI Personality

Sarah is configured as a professional medical spa receptionist who:
- ✅ Provides helpful, accurate information about treatments
- ✅ Guides users toward consultations and bookings
- ✅ Detects safety concerns and refers to specialists
- ❌ Never provides medical advice or guarantees results
- ❌ Defers complex medical questions to professionals

## 📊 Usage & Monitoring

The system includes built-in analytics tracking:
- AI response quality and confidence scores
- Safety flag detection rates
- Conversion to booking/consultation actions
- Fallback usage when API is unavailable

## 🛡️ Safety Features

- **Automatic Detection**: Pregnancy, allergies, medical conditions
- **Smart Referrals**: Routes concerning cases to human specialists
- **Graceful Fallback**: Works even if OpenAI API is down
- **Rate Limiting**: Built-in protection against abuse

## 🚨 Troubleshooting

**"API key not configured" message?**
- Check that you replaced `your_openai_api_key_here` with your real key
- Restart the dev server after changing `.env.local`

**AI responses not working?**
- Check browser console for API errors
- Verify your OpenAI account has credits
- Test the API health endpoint: `GET /api/chat`

**Want to test without API key?**
- The system gracefully falls back to rule-based responses
- Users get helpful guidance even without AI integration