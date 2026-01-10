# ✨ Welcome to Your Spark Template!
You've just launched your brand-new Spark Template Codespace — everything's fired up and ready for you to explore, build, and create with Spark!

This template is your blank canvas. It comes with a minimal setup to help you get started quickly with Spark development.

## 🚀 What's Inside?
- A clean, minimal Spark environment
- Pre-configured for GitHub Spark
- AI-powered features via GitHub Models API
- Improved error handling for AI requests
- Ready to scale with your ideas

## 💡 Using AI Features

This Spark includes improved error handling for AI features powered by GitHub Models API. When you use AI capabilities, you'll get clear, actionable error messages if something goes wrong.

### Example: Using AI in Your Spark

```typescript
import { useLLM } from '@/hooks/use-llm';
import { SparkConfigAlert } from '@/components/SparkConfigAlert';

function MyComponent() {
  const { callLLM, isLoading, error, isConfigError } = useLLM();
  
  const handleAIRequest = async () => {
    const result = await callLLM("Your prompt here");
    if (result) {
      console.log('AI response:', result);
    }
  };
  
  if (error) {
    return <SparkConfigAlert error={error} isConfigError={isConfigError} />;
  }
  
  return (
    <button onClick={handleAIRequest} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Ask AI'}
    </button>
  );
}
```

## 🎯 Supported AI Models

This Spark works with GitHub Models API, supporting:

- `openai/gpt-4o` (default)
- `openai/gpt-4o-mini`
- `meta/meta-llama-3.1-405b-instruct`
- `meta/meta-llama-3.1-70b-instruct`
- `meta/meta-llama-3.1-8b-instruct`
- `cohere/cohere-command-r-plus`
- `cohere/cohere-command-r`
- `mistral-ai/mistral-large`
- `mistral-ai/mistral-nemo`
- And more...

## 🔧 Error Handling

The app automatically handles common AI API errors:

| Error | Message | What it means |
|-------|---------|---------------|
| 400 | Invalid request format | The request payload doesn't match expected format |
| 401 | Authentication failed | Permission issues with GitHub Models API |
| 403 | Access denied | This Spark doesn't have required permissions |
| 429 | Rate limit exceeded | Too many requests - wait and try again |
| 500/503 | Service unavailable | AI service is temporarily down |

### Troubleshooting

**"Invalid request: The AI model request format may be incorrect"**

Check that your prompt is a valid string and the model name is correct (e.g., `openai/gpt-4o`).

**"Authentication failed" or "Access denied"**

Your Spark may not have the required permissions to access GitHub Models API. This is managed by GitHub's infrastructure. If you're the Spark owner and this persists, contact GitHub support.

**"Rate limit exceeded"**

You've made too many AI requests in a short time. Wait a moment before trying again.

## 🧠 What Can You Do?

Right now, this is just a starting point — the perfect place to begin building and testing your Spark applications with AI capabilities.

Try the AI Test page at `/ai-test` to see the error handling in action!
  
## 🧹 Just Exploring?
No problem! If you were just checking things out and don't need to keep this code:

- Simply delete your Spark.
- Everything will be cleaned up — no traces left behind.

## 📄 License For Spark Template Resources 

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
