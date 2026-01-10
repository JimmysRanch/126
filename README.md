# ✨ Welcome to Your Spark Template!
You've just launched your brand-new Spark Template Codespace — everything’s fired up and ready for you to explore, build, and create with Spark!

This template is your blank canvas. It comes with a minimal setup to help you get started quickly with Spark development.

## 🚀 What's Inside?
- A clean, minimal Spark environment
- Pre-configured for local development
- AI-powered features via GitHub Models API
- Ready to scale with your ideas

## ⚙️ Configuration

### Required Environment Variables

For GitHub Spark AI features to work, you need to configure the following:

#### `GITHUB_TOKEN` (Required for AI features)

GitHub Spark uses the GitHub Models API for AI-powered features. You need a GitHub Personal Access Token to authenticate.

**Setup Instructions:**

1. **Create a Personal Access Token:**
   - Go to [github.com/settings/tokens](https://github.com/settings/tokens)
   - Click "Generate new token" (classic)
   - Select the following scopes:
     - `repo` (if you need access to private repositories)
   - Generate and copy the token

2. **Set the Environment Variable:**
   
   For local development:
   ```bash
   export GITHUB_TOKEN=your_github_personal_access_token_here
   ```
   
   For persistent configuration, add it to your shell profile (`.bashrc`, `.zshrc`, etc.):
   ```bash
   echo 'export GITHUB_TOKEN=your_token_here' >> ~/.bashrc
   source ~/.bashrc
   ```

3. **Restart the Development Server:**
   ```bash
   npm run dev
   ```

### Supported AI Models

GitHub Spark supports the following AI models via GitHub Models API:

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

### Troubleshooting

**"Failed to submit prompt: Error: API request failed with status 400"**

This error typically means:
- The `GITHUB_TOKEN` environment variable is not set
- The token is invalid or expired
- The token doesn't have required permissions

Follow the setup instructions above to resolve this issue.

**Configuration Validation**

The application automatically validates configuration at startup and will display warnings if required environment variables are missing.

## 🧠 What Can You Do?

Right now, this is just a starting point — the perfect place to begin building and testing your Spark applications.

### Using AI Features

To use AI features in your Spark app:

```typescript
import { useLLM } from '@/hooks/use-llm';

function MyComponent() {
  const { callLLM, isLoading, error, isConfigError } = useLLM();
  
  const handleAIRequest = async () => {
    const result = await callLLM("Your prompt here");
    if (result) {
      console.log('AI response:', result);
    }
  };
  
  if (isConfigError) {
    return <SparkConfigAlert error={error} isConfigError={isConfigError} />;
  }
  
  // ... rest of component
}
```

🧹 Just Exploring?
No problem! If you were just checking things out and don’t need to keep this code:

- Simply delete your Spark.
- Everything will be cleaned up — no traces left behind.

📄 License For Spark Template Resources 

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
