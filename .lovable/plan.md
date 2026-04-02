

## Cleanup: Delete unused Google Sheets hook

### Change

**File to delete**: `src/hooks/useGoogleSheetForm.ts`

This file is no longer imported by any component — all 5 forms now use `useFormSubmit` instead. Removing it keeps the codebase clean.

### No other changes needed

The database is connected, tables exist, admin user is seeded. The remaining work is just this cleanup.

