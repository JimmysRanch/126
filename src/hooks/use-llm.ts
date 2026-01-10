import { useState, useCallback } from 'react';
import { llm as sparkLLM } from '@github/spark/llm';
import { getConfigErrorMessage, isConfigurationError } from '@/lib/spark-config';

export interface UseLLMOptions {
  modelName?: string;
  jsonMode?: boolean;
  onError?: (error: Error) => void;
}

export interface UseLLMResult {
  /**
   * Call the LLM with a prompt
   */
  callLLM: (prompt: string) => Promise<string | null>;
  
  /**
   * Whether a request is in progress
   */
  isLoading: boolean;
  
  /**
   * The last error that occurred
   */
  error: string | null;
  
  /**
   * Whether the error is a configuration error
   */
  isConfigError: boolean;
  
  /**
   * Clear the error state
   */
  clearError: () => void;
}

/**
 * React hook for calling the GitHub Spark LLM with improved error handling
 * 
 * @example
 * ```tsx
 * const { callLLM, isLoading, error, isConfigError } = useLLM();
 * 
 * const handleSubmit = async () => {
 *   const result = await callLLM("What is the weather?");
 *   if (result) {
 *     console.log(result);
 *   }
 * };
 * 
 * if (isConfigError) {
 *   return <Alert>{error}</Alert>;
 * }
 * ```
 */
export function useLLM(options: UseLLMOptions = {}): UseLLMResult {
  const { modelName, jsonMode, onError } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigError, setIsConfigError] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
    setIsConfigError(false);
  }, []);

  const callLLM = useCallback(async (prompt: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    setIsConfigError(false);

    try {
      // Use nullish coalescing to properly handle explicit false values
      const result = await sparkLLM(prompt, modelName ?? 'openai/gpt-4o', jsonMode ?? false);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      const isConfig = isConfigurationError(errorObj);
      const errorMessage = getConfigErrorMessage(errorObj);
      
      setError(errorMessage);
      setIsConfigError(isConfig);
      
      if (onError) {
        onError(errorObj);
      }
      
      console.error('LLM request failed:', errorMessage, errorObj);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [modelName, jsonMode, onError]);

  return {
    callLLM,
    isLoading,
    error,
    isConfigError,
    clearError,
  };
}
