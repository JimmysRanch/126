import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

export interface SparkConfigAlertProps {
  error: string | null;
  isConfigError: boolean;
  className?: string;
}

/**
 * Component to display GitHub Spark configuration errors
 * Shows user-friendly messages for common configuration issues
 */
export function SparkConfigAlert({ error, isConfigError, className = "" }: SparkConfigAlertProps) {
  if (!error) return null;

  return (
    <Alert 
      variant={isConfigError ? "destructive" : "default"} 
      className={className}
    >
      {isConfigError ? <AlertTriangle className="h-4 w-4" /> : <Info className="h-4 w-4" />}
      <AlertTitle>
        {isConfigError ? "Configuration Error" : "Error"}
      </AlertTitle>
      <AlertDescription className="mt-2 text-sm">
        {error}
        {isConfigError && (
          <div className="mt-3 text-xs bg-muted/50 p-2 rounded border">
            <strong>To fix this issue:</strong>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Create a GitHub Personal Access Token at <code>github.com/settings/tokens</code></li>
              <li>Set the token as environment variable: <code>GITHUB_TOKEN=your_token</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
