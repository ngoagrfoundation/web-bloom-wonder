import { ReactNode } from "react";
import { isValidUrl } from "@/lib/sanitize";

interface SecureLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

/**
 * Secure external link component
 * Automatically adds rel="noopener noreferrer" for external URLs
 * Validates URLs before rendering
 */
const SecureLink = ({
  href,
  children,
  className = "",
  ariaLabel,
  onClick,
}: SecureLinkProps) => {
  // Check if link is external
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  // Validate external URLs
  if (isExternal && !isValidUrl(href)) {
    console.warn("Invalid URL blocked:", href);
    return (
      <span className={className} aria-label={ariaLabel}>
        {children}
      </span>
    );
  }

  // For external links, add security attributes
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  // For internal links, render normally
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default SecureLink;
