
## YouTube Auto-Sync to Website

### How It Works

Since your API key is a **public key** (YouTube Data API v3, read-only), it's safe to use directly in the frontend. When visitors load your site, it will fetch your latest YouTube videos and display them alongside your manually-uploaded reels — no server-side code needed.

### Step-by-Step Setup

**Step 1: Add your YouTube API Key and Channel ID in Admin → Site Settings**

I'll add two new fields to your Site Settings page:
- `youtube_api_key` — Your API key: `AIzaSyC361egUHgXazbU2Blpr7lwjMhYgF903Jk`
- `youtube_channel_id` — Your YouTube Channel ID

**How to find your Channel ID:**
1. Go to [youtube.com](https://youtube.com) and sign in
2. Click your profile picture → "Your channel"
3. Look at the URL: `youtube.com/channel/UC_XXXXX` — the `UC_XXXXX` part is your Channel ID
4. Alternatively, go to [youtube.com/account_advanced](https://youtube.com/account_advanced) to see it directly

**Step 2: Save both values in Site Settings**

Once saved, the website will automatically fetch your latest uploads.

---

### Technical Implementation

**Files to change:**

| File | Change |
|------|--------|
| `src/pages/admin/SiteSettings.tsx` | Add YouTube API Key + Channel ID input fields |
| `src/lib/api.ts` | Add `fetchYouTubeVideos()` function using YouTube Data API v3 |
| `src/components/ReelsSection.tsx` | Merge YouTube videos with database reels, show both |
| `src/pages/Gallery.tsx` | Add a "Videos" tab/section showing all YouTube videos + reels |

**How the fetch works:**
```
GET https://www.googleapis.com/youtube/v3/search
  ?part=snippet
  &channelId={CHANNEL_ID}
  &key={API_KEY}
  &order=date
  &type=video
  &maxResults=20
```

This returns your latest 20 videos with title, thumbnail, and video ID. Each video becomes a reel card with:
- Thumbnail from YouTube
- Title from YouTube
- Click opens YouTube embed (`youtube.com/embed/{videoId}`)

**Merge logic in ReelsSection:**
1. Fetch database reels (manual uploads)
2. Fetch YouTube videos via API
3. Merge: manual reels first, then YouTube videos (deduplicating by URL)
4. Display combined list

**Gallery page:**
- Add a "Videos" filter/tab alongside image categories
- Shows all reels + YouTube videos in a grid

**Quota note:** YouTube Data API gives 10,000 units/day free. Each search call costs 100 units = ~100 page loads/day before needing caching. For a foundation site this is more than enough.

---

### What You Need To Do

1. After I implement this, go to **Admin → Site Settings**
2. Paste your API key: `AIzaSyC361egUHgXazbU2Blpr7lwjMhYgF903Jk`
3. Paste your YouTube Channel ID (find it using instructions above)
4. Click Save — your videos will immediately appear on the landing page and gallery
