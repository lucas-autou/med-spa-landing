# AI Configuration - GPT-5-nano Ready Setup

## Overview
This project features intelligent model selection that automatically adapts to GPT-5-nano when available, with seamless fallback to gpt-4o-mini for reliable operation.

## Model Information
- **Model**: GPT-5-nano
- **Pricing**: $0.05/1M input tokens, $0.40/1M output tokens
- **Performance**: Smallest and fastest variant of GPT-5
- **Knowledge Cutoff**: May 30, 2024
- **Key Features**: Low latency, cost-effective, supports all core API features

## Smart Configuration
The AI service features intelligent model detection and parameter optimization:

```env
# Current: Fast & reliable operation
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=80

# Future: Switch to GPT-5-nano when available
# OPENAI_MODEL=gpt-5-nano-2025-08-07
```

### Automatic Parameter Selection:
- **GPT-5 models**: Uses `max_completion_tokens`, no temperature
- **GPT-4 models**: Uses `max_tokens`, temperature 0.3 for consistency

## API Key Setup
1. Get your OpenAI API key from: https://platform.openai.com/account/api-keys
2. Add it to `.env.local`: `OPENAI_API_KEY=sk-xxx...`
3. Ensure the key has access to GPT-5 models

## Optimizations Applied
- **Ultra-compressed system prompt** for faster processing
- **Reduced token limit** (80) for speed while maintaining quality
- **GPT-5 parameter compatibility** (`max_completion_tokens` instead of `max_tokens`)
- **Optimized conversation history** (max 6 recent messages)
- **Smart error handling** with graceful fallbacks
- **Contextual chip generation** based on AI responses

## Important API Changes
GPT-5-nano has specific parameter restrictions:

### ✅ Supported Parameters:
- `max_completion_tokens` (replaces `max_tokens`)
- `messages` (conversation history)
- `model` (gpt-5-nano)
- `stream` (false for synchronous responses)

### ❌ Not Supported by GPT-5-nano:
- `max_tokens` (use `max_completion_tokens` instead)
- `temperature` (fixed at 1.0, cannot be customized)
- `top_p` (not supported)
- `presence_penalty` (not supported)
- `frequency_penalty` (not supported)

This simplified parameter set optimizes GPT-5-nano for ultra-fast responses with minimal configuration overhead.

## Performance Characteristics
- **Response Time**: Sub-second responses typical
- **Cost**: ~90% less expensive than full GPT-5
- **Quality**: Maintains professional, contextual responses
- **Reliability**: Robust error handling and fallbacks

## Usage in Project
The AI powers the virtual receptionist "Sarah" with:
- Natural conversation about treatments and pricing
- Smart booking assistance and consultation scheduling
- Safety detection for medical concerns
- Contextual follow-up suggestions

## Files Modified for GPT-5-nano
- `lib/aiService.ts` - Core AI service with optimized parameters
- `app/api/chat/route.ts` - API endpoint with model configuration
- `.env.local` - Environment variables for GPT-5-nano
- `components/InteractiveHero.tsx` - Frontend AI integration

## Testing
Use the health check endpoint to verify configuration:
- GET `/api/chat` - Returns model info and API key status
- Test conversation through the interactive demo