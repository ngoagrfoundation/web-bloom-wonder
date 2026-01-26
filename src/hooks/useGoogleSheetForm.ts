import { useState, useCallback } from "react";
import { useFormSecurity } from "./useFormSecurity";
import { toast } from "@/hooks/use-toast";

interface UseGoogleSheetFormOptions {
  scriptUrl: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseGoogleSheetFormReturn {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  submitForm: (data: Record<string, unknown>) => Promise<boolean>;
  resetForm: () => void;
  security: ReturnType<typeof useFormSecurity>;
}

/**
 * Custom hook for submitting forms to Google Sheets via Apps Script
 */
export const useGoogleSheetForm = (options: UseGoogleSheetFormOptions): UseGoogleSheetFormReturn => {
  const { scriptUrl, onSuccess, onError } = options;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const security = useFormSecurity({ minSubmitTimeSeconds: 3, cooldownMs: 30000 });

  const submitForm = useCallback(async (data: Record<string, unknown>): Promise<boolean> => {
    // Security validations
    if (!security.validateSubmission()) {
      if (security.isBot) {
        setError("Submission blocked.");
        return false;
      }
      if (security.isCooldown) {
        setError(`Please wait ${security.cooldownRemaining} seconds before submitting again.`);
        toast({
          title: "Please wait",
          description: `You can submit again in ${security.cooldownRemaining} seconds.`,
          variant: "destructive",
        });
        return false;
      }
      setError("Please take your time filling out the form.");
      return false;
    }

    // Check content security for all string fields
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string" && !security.checkContentSecurity(value)) {
        setError(`Invalid content detected in ${key}. Please remove any suspicious characters.`);
        return false;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors", // Google Apps Script requires no-cors
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // With no-cors, we can't read the response, so we assume success
      // The response type will be "opaque" which means we can't check status
      security.recordSubmission();
      setIsSuccess(true);
      
      toast({
        title: "Submitted successfully!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      
      onSuccess?.();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit form";
      setError(errorMessage);
      
      toast({
        title: "Submission failed",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
      
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [scriptUrl, security, onSuccess, onError]);

  const resetForm = useCallback(() => {
    setIsSuccess(false);
    setError(null);
  }, []);

  return {
    isSubmitting,
    isSuccess,
    error,
    submitForm,
    resetForm,
    security,
  };
};

export default useGoogleSheetForm;
