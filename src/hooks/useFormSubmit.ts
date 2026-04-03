import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFormSecurity } from '@/hooks/useFormSecurity';
import { submitFormToAPI } from '@/lib/api';

interface UseFormSubmitOptions {
  formType: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  showSuccessToast?: boolean;
}

interface UseFormSubmitReturn {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  submitForm: (data: Record<string, unknown>) => Promise<boolean>;
  resetForm: () => void;
  security: ReturnType<typeof useFormSecurity>;
}

export const useFormSubmit = (options: UseFormSubmitOptions): UseFormSubmitReturn => {
  const { formType, onSuccess, onError, showSuccessToast = true } = options;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const security = useFormSecurity({ minSubmitTimeSeconds: 3, cooldownMs: 30000 });

  const submitForm = async (data: Record<string, unknown>): Promise<boolean> => {
    if (!security.validateSubmission()) {
      toast({
        title: "Submission blocked",
        description: "Please wait before submitting again.",
        variant: "destructive",
      });
      return false;
    }

    // Check content security on string fields
    for (const value of Object.values(data)) {
      if (typeof value === 'string' && !security.checkContentSecurity(value)) {
        toast({
          title: "Invalid content",
          description: "Your submission contains invalid content. Please check and try again.",
          variant: "destructive",
        });
        return false;
      }
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await submitFormToAPI(formType, data);
      
      if (success) {
        setIsSuccess(true);
        security.recordSubmission();
        if (showSuccessToast) {
          toast({
            title: "Submitted successfully!",
            description: "We will get back to you within 24 hr.",
          });
        }
        onSuccess?.();
        return true;
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      const errorMessage = 'Failed to submit. Please try again later.';
      setError(errorMessage);
      toast({
        title: "Submission failed",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setError(null);
  };

  return { isSubmitting, isSuccess, error, submitForm, resetForm, security };
};

export default useFormSubmit;
