

## Update First Hero Slider Text

### What Will Change

The first slide in the hero carousel will be updated with your new motto text.

**Current Text:**
- Title: "Empowering Communities,"
- Subtitle: "Transforming Lives"
- Description: "Dedicated to uplifting rural communities through education, healthcare, and sustainable livelihood programs across India."

**New Text:**
- Title: "Our Motto is,"
- Subtitle: "Building a self-sustainable and eco-friendly society"
- Description: (Will keep the existing description or update if you prefer)

---

### Technical Details

**File to Modify:** `src/components/HeroSection.tsx`

**Change Location:** Lines 10-16 (first slide in the `slides` array)

```typescript
// From:
{
  image: heroImage,
  alt: "Community volunteers working together",
  title: "Empowering Communities,",
  subtitle: "Transforming Lives",
  description: "Dedicated to uplifting rural communities...",
}

// To:
{
  image: heroImage,
  alt: "Community volunteers working together",
  title: "Our Motto is,",
  subtitle: "Building a self-sustainable and eco-friendly society",
  description: "Dedicated to uplifting rural communities...",
}
```

---

### Summary

| File | Change |
|------|--------|
| `src/components/HeroSection.tsx` | Update first slide title and subtitle text |

