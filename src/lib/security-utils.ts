// Security utility functions

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

/**
 * Validate Indian phone number
 */
export const isValidIndianPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * Validate PAN number format
 */
export const isValidPAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
};

/**
 * Sanitize string input - trim and limit length
 */
export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ""); // Strip potential HTML tags
};

/**
 * Escape HTML entities
 */
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Check if a string contains potentially dangerous content
 */
export const containsSuspiciousContent = (input: string): boolean => {
  const suspiciousPatterns = [
    /<script\b/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /data:/i,
    /vbscript:/i,
  ];
  return suspiciousPatterns.some((pattern) => pattern.test(input));
};

/**
 * Generate a simple honeypot field name
 */
export const generateHoneypotName = (): string => {
  const names = ["website", "url", "homepage", "company_url"];
  return names[Math.floor(Math.random() * names.length)];
};

/**
 * Check submission timing (bot detection)
 * Returns true if submission seems legitimate (took at least minSeconds)
 */
export const isLegitimateSubmissionTiming = (
  startTime: number,
  minSeconds: number = 3
): boolean => {
  const elapsed = (Date.now() - startTime) / 1000;
  return elapsed >= minSeconds;
};

/**
 * Rate limiting helper - checks if action is within rate limit
 */
export const createRateLimiter = (maxAttempts: number, windowMs: number) => {
  const attempts: number[] = [];

  return {
    checkLimit: (): boolean => {
      const now = Date.now();
      // Remove old attempts outside the window
      while (attempts.length > 0 && attempts[0] < now - windowMs) {
        attempts.shift();
      }
      return attempts.length < maxAttempts;
    },
    recordAttempt: () => {
      attempts.push(Date.now());
    },
    getRemainingAttempts: (): number => {
      const now = Date.now();
      const validAttempts = attempts.filter((t) => t >= now - windowMs);
      return Math.max(0, maxAttempts - validAttempts.length);
    },
  };
};
