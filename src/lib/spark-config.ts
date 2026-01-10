/**
 * GitHub Spark Configuration Validation
 * 
 * This module validates API responses and provides user-friendly error messages
 * for GitHub Spark AI features.
 */

export interface SparkConfigValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Gets a user-friendly error message for common API errors
 */
export function getConfigErrorMessage(error: any): string {
  const errorText = typeof error === 'string' ? error : error?.message || '';
  
  // Check for structured error response
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
  
  // Parse HTTP status codes
  if (errorText.includes('400') || errorText.includes('Bad Request')) {
    return 'Invalid request: The AI model request format may be incorrect. Please check your prompt and try again.';
  }
  
  if (errorText.includes('401') || errorText.includes('Unauthorized')) {
    return 'Authentication failed: Unable to access GitHub Models API. This Spark may not have the required permissions.';
  }
  
  if (errorText.includes('403') || errorText.includes('Forbidden')) {
    return 'Access denied: This Spark does not have permission to use GitHub Models API.';
  }
  
  if (errorText.includes('404')) {
    return 'Service not found: The GitHub Models API endpoint may be unavailable.';
  }
  
  if (errorText.includes('429') || errorText.includes('Too Many Requests')) {
    return 'Rate limit exceeded: Too many AI requests. Please wait a moment and try again.';
  }
  
  if (errorText.includes('500') || errorText.includes('Internal Server Error')) {
    return 'Server error: The AI service encountered an error. Please try again later.';
  }
  
  if (errorText.includes('503') || errorText.includes('Service Unavailable')) {
    return 'Service unavailable: The AI service is temporarily unavailable. Please try again later.';
  }
  
  // Return original error if we can't provide a better message
  return errorText || 'An unknown error occurred while processing your request';
}

/**
 * Checks if an error is related to configuration/permissions issues
 */
export function isConfigurationError(error: any): boolean {
  const errorText = typeof error === 'string' ? error : error?.message || '';
  
  return (
    errorText.includes('401') ||
    errorText.includes('403') ||
    errorText.includes('Unauthorized') ||
    errorText.includes('Forbidden') ||
    errorText.includes('authentication') ||
    errorText.includes('permission')
  );
}
