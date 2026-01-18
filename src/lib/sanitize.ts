import DOMPurify from "dompurify";

// Configure DOMPurify with strict settings
const createSanitizer = () => {
  // Only allow safe HTML tags
  const ALLOWED_TAGS = [
    "p", "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "strong", "em", "b", "i", "u",
    "a", "br", "hr",
    "blockquote", "code", "pre",
    "table", "thead", "tbody", "tr", "th", "td",
    "span", "div"
  ];

  // Only allow safe attributes
  const ALLOWED_ATTR = ["href", "target", "rel", "class", "id"];

  return {
    sanitizeHTML: (dirty: string): string => {
      return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ALLOW_DATA_ATTR: false,
        ADD_ATTR: ["target"], // Allow target for links
        FORBID_TAGS: ["script", "style", "iframe", "form", "input", "button"],
        FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur"],
      });
    },

    // Strict sanitization for user-generated content
    sanitizeUserContent: (dirty: string): string => {
      return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ["p", "br", "strong", "em"],
        ALLOWED_ATTR: [],
        ALLOW_DATA_ATTR: false,
      });
    },

    // Sanitize plain text (strip all HTML)
    sanitizeText: (dirty: string): string => {
      return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      });
    },
  };
};

export const { sanitizeHTML, sanitizeUserContent, sanitizeText } = createSanitizer();

// URL validation and sanitization
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};

// Encode URL parameters safely
export const encodeUrlParam = (param: string): string => {
  return encodeURIComponent(param);
};

// Create safe share URLs
export const createShareUrl = (platform: "facebook" | "twitter" | "linkedin", url: string, title?: string): string => {
  const encodedUrl = encodeUrlParam(url);
  const encodedTitle = title ? encodeUrlParam(title) : "";

  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "linkedin":
      return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
    default:
      return "#";
  }
};
