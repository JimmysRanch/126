import { useState } from 'react';
import { useLLM } from '@/hooks/use-llm';
import { SparkConfigAlert } from '@/components/SparkConfigAlert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

/**
 * Example page demonstrating the useLLM hook with error handling
 * This shows how to properly handle configuration errors and display them to users
 */
export function AITestPage() {
  const [prompt, setPrompt] = useState('What is the weather like today?');
  const [result, setResult] = useState<string | null>(null);
  const { callLLM, isLoading, error, isConfigError, clearError } = useLLM();

  const handleSubmit = async () => {
    clearError();
    setResult(null);
    
    const response = await callLLM(prompt);
    if (response) {
      setResult(response);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant Test</CardTitle>
          <CardDescription>
            Test the GitHub Spark AI integration with improved error handling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <SparkConfigAlert 
              error={error} 
              isConfigError={isConfigError} 
              className="mb-4"
            />
          )}
          
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Enter your prompt:
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask the AI anything..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !prompt.trim()}
            className="w-full"
          >
            {isLoading ? 'Processing...' : 'Submit Prompt'}
          </Button>

          {result && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-sm">AI Response:</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{result}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
