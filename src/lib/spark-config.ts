/**
 * GitHub Spark Configuration Validation
 * 
 * This module validates required environment variables and configuration
 * for GitHub Spark AI features to work properly.
 */

export interface SparkConfigValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates the Spark configuration at startup
 * @returns Validation result with any errors or warnings
 */
export function validateSparkConfig(): SparkConfigValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for GITHUB_TOKEN (required for LLM features)
  // In the browser, we can't access process.env directly, but we can check
  // if the backend is properly configured by making a test request
  
  // For now, we'll provide a client-side validation stub
  // The actual validation happens on the server side via the Vite plugin
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Gets a user-friendly error message for common configuration issues
 */
export function getConfigErrorMessage(error: any): string {
  const errorText = typeof error === 'string' ? error : error?.message || '';
  
  // Check for structured error response from our validation plugin
  if (error?.response) {
    try {
      const data = typeof error.response === 'string' ? JSON.parse(error.response) : error.response;
      if (data?.error?.message) {
        return `${data.error.message}: ${data.error.details || ''}`;
      }
    } catch (e) {
      // Fall through to text parsing
    }
  }
  
  // Parse for specific error codes
  if (errorText.includes('MISSING_GITHUB_TOKEN') || errorText.includes('not configured')) {
    return 'Missing GITHUB_TOKEN: Please set the GITHUB_TOKEN environment variable with a valid GitHub personal access token.';
  }
  
  // Parse status codes
  if (errorText.includes('503') || errorText.includes('Service Unavailable')) {
    return 'Service unavailable: GitHub Spark is not properly configured. Please ensure GITHUB_TOKEN is set.';
  }
  
  if (errorText.includes('400') || errorText.includes('Bad Request')) {
    return 'API request failed: Invalid request format or missing authentication. Please ensure GITHUB_TOKEN is set in your environment variables.';
  }
  
  if (errorText.includes('401') || errorText.includes('Unauthorized')) {
    return 'Authentication failed: Your GITHUB_TOKEN is invalid or expired. Please update your environment variables.';
  }
  
  if (errorText.includes('403') || errorText.includes('Forbidden')) {
    return 'Access denied: Your GITHUB_TOKEN does not have the required permissions for GitHub Models API.';
  }
  
  if (errorText.includes('404')) {
    return 'API endpoint not found: The GitHub Models API endpoint may be unavailable.';
  }
  
  if (errorText.includes('GITHUB_TOKEN') || errorText.includes('github.*token')) {
    return 'Missing GITHUB_TOKEN: Please set the GITHUB_TOKEN environment variable with a valid GitHub personal access token.';
  }
  
  // Return original error if we can't provide a better message
  return errorText || 'An unknown error occurred';
}

/**
 * Checks if an error is related to configuration issues
 */
export function isConfigurationError(error: any): boolean {
  const errorText = typeof error === 'string' ? error : error?.message || '';
  
  return (
    errorText.includes('GITHUB_TOKEN') ||
    errorText.includes('MISSING_GITHUB_TOKEN') ||
    errorText.includes('not configured') ||
    errorText.includes('503') ||
    errorText.includes('400') ||
    errorText.includes('401') ||
    errorText.includes('403') ||
    errorText.includes('authentication') ||
    errorText.includes('unauthorized')
  );
}
