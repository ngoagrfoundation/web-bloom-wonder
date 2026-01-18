import { useState, useCallback, useRef, useEffect } from "react";
import { isLegitimateSubmissionTiming, containsSuspiciousContent } from "@/lib/security-utils";

interface FormSecurityOptions {
  minSubmitTimeSeconds?: number;
  cooldownMs?: number;
}

interface FormSecurityReturn {
  honeypotProps: {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    style: React.CSSProperties;
    tabIndex: number;
    autoComplete: string;
    "aria-hidden": boolean;
  };
  isBot: boolean;
  isCooldown: boolean;
  cooldownRemaining: number;
  validateSubmission: () => boolean;
  recordSubmission: () => void;
  checkContentSecurity: (content: string) => boolean;
}

/**
 * Custom hook for form security measures
 * Includes honeypot fields, timing validation, and cooldown periods
 */
export const useFormSecurity = (options: FormSecurityOptions = {}): FormSecurityReturn => {
  const { minSubmitTimeSeconds = 3, cooldownMs = 30000 } = options;

  const [honeypotValue, setHoneypotValue] = useState("");
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  
  const formLoadTime = useRef(Date.now());
  const lastSubmitTime = useRef<number | null>(null);

  // Check if the honeypot field was filled (bot detection)
  const isBot = honeypotValue.length > 0;

  // Update cooldown timer
  useEffect(() => {
    if (!isCooldown) return;

    const interval = setInterval(() => {
      if (lastSubmitTime.current) {
        const elapsed = Date.now() - lastSubmitTime.current;
        const remaining = Math.max(0, Math.ceil((cooldownMs - elapsed) / 1000));
        setCooldownRemaining(remaining);
        
        if (remaining === 0) {
          setIsCooldown(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isCooldown, cooldownMs]);

  // Validate submission (timing, honeypot, cooldown)
  const validateSubmission = useCallback((): boolean => {
    // Check honeypot
    if (isBot) {
      console.warn("Bot detected via honeypot");
      return false;
    }

    // Check timing (too fast = likely bot)
    if (!isLegitimateSubmissionTiming(formLoadTime.current, minSubmitTimeSeconds)) {
      console.warn("Submission too fast, possible bot");
      return false;
    }

    // Check cooldown
    if (isCooldown) {
      console.warn("Submission during cooldown period");
      return false;
    }

    return true;
  }, [isBot, isCooldown, minSubmitTimeSeconds]);

  // Record a submission and start cooldown
  const recordSubmission = useCallback(() => {
    lastSubmitTime.current = Date.now();
    setIsCooldown(true);
    setCooldownRemaining(Math.ceil(cooldownMs / 1000));
  }, [cooldownMs]);

  // Check content for suspicious patterns
  const checkContentSecurity = useCallback((content: string): boolean => {
    return !containsSuspiciousContent(content);
  }, []);

  // Honeypot field props
  const honeypotProps = {
    name: "website_url", // Looks like a legitimate field to bots
    value: honeypotValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setHoneypotValue(e.target.value),
    style: {
      position: "absolute" as const,
      left: "-9999px",
      opacity: 0,
      height: 0,
      width: 0,
      overflow: "hidden" as const,
    },
    tabIndex: -1,
    autoComplete: "off",
    "aria-hidden": true as const,
  };

  return {
    honeypotProps,
    isBot,
    isCooldown,
    cooldownRemaining,
    validateSubmission,
    recordSubmission,
    checkContentSecurity,
  };
};

export default useFormSecurity;
