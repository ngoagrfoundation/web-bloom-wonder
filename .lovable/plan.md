

## Fix: Forms Save Data But Frontend Shows Error

### Root Cause

The data saves because the PHP executes successfully. But the **frontend thinks it failed** because of a **cross-origin issue**:

- User browses on `https://www.agrfoundation.ngo`
- `api.ts` sends requests to `https://agrfoundation.ngo/api` (no `www`)
- This is a **cross-origin request** — the browser may block reading the response even though the server processes it
- `response.ok` returns false or the fetch throws, so the UI shows "Submission failed"

### The Fix

**One line change in `src/lib/api.ts`:**

Change the API routing logic so that when the user is on `agrfoundation.ngo` (with or without `www`), it uses **relative `/api`** instead of an absolute URL. This eliminates the cross-origin problem entirely.

For Lovable preview domains, point to the absolute production URL so forms work in preview too.

```
Before:  isPreview ? '/api' : 'https://agrfoundation.ngo/api'
After:   isLovablePreview ? 'https://agrfoundation.ngo/api' : '/api'
```

- On `www.agrfoundation.ngo` → uses `/api` (same-origin, no CORS needed)
- On `agrfoundation.ngo` → uses `/api` (same-origin)
- On `*.lovable.app` → uses `https://agrfoundation.ngo/api` (hits real backend)

### Files to Change

| File | Change |
|------|--------|
| `src/lib/api.ts` | Flip the API base URL logic — relative for production, absolute for Lovable preview |

### Result

- Forms will show "Submitted successfully!" instead of the error toast
- No database changes needed — the tables and data are already working correctly

