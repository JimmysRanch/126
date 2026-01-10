import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

export interface SparkConfigAlertProps {
  error: string | null;
  isConfigError: boolean;
  className?: string;
}

/**
 * Component to display GitHub Spark AI errors
 * Shows user-friendly messages for common API issues
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
        {isConfigError ? "Permission Error" : "Error"}
      </AlertTitle>
      <AlertDescription className="mt-2 text-sm">
        {error}
        {isConfigError && (
          <div className="mt-3 text-xs bg-muted/50 p-2 rounded border">
            <strong>If you're the Spark owner:</strong>
            <p className="mt-1">This Spark may not have the necessary permissions to access GitHub Models API. Contact GitHub support for assistance.</p>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
