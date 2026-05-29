# Clenzara.com — Cache Optimization Guide

## Current Status (Verified)
- **CDN**: Hostinger hcdn — **ACTIVE** ✅
- **Asset caching**: `max-age=604800` (7 days) ✅
- **HTML caching**: `DYNAMIC` via hcdn edge nodes
- **TTFB**: ~0.38s (from US edge node)
- **Server**: hcdn + hpanel

## Hostinger API Limitation
The Hostinger REST API (developers.hostinger.com) has **no cache/CDN management endpoints** — caching can only be configured through the hPanel web interface.

## Owner Action: Enable Full Page Caching in hPanel

### Step 1: Login to Hostinger hPanel
1. Go to https://hpanel.hostinger.com
2. Select the hosting plan containing clenzara.com

### Step 2: Navigate to Cache Settings
3. In the sidebar, click **"Cache"** or **"Performance"**
4. Look for **"Automatic Cache"**, **"Edge Caching"**, or **"Full Page Cache"**

### Step 3: Enable Caching
5. Toggle **"Automatic Cache"** → **ON**
6. Set cache duration to at least **4 hours** for HTML
7. Enable **"Edge Caching"** if available (serves from CDN edge nodes)
8. Click **Save**

### Step 4: Advanced (Optional)
9. In **"Advanced Cache"**, add exceptions for:
   - `/api/` — if GAS endpoint calls need to bypass cache
   - `/learn/` — only if content changes frequently
10. Enable **"Brotli Compression"** for smaller file sizes
11. Enable **"HTTP/2 Server Push"** for faster resource delivery

## Verification After Setup
```bash
# Check for cache headers
curl -sI https://clenzara.com | grep -i "cache\|hcdn\|max-age"
# Expected: cache-control: public, max-age=14400 (or your set duration)
# Expected: x-hcdn-cache-status: HIT

# Check TTFB improvement
curl -w "TTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" -o /dev/null -s https://clenzara.com
# Target: TTFB < 0.2s
```

## What's Already Optimized
- ✅ Hostinger CDN active on hcdn infrastructure
- ✅ Static assets served with 7-day cache (`max-age=604800`)
- ✅ ETags enabled for cache validation
- ✅ ETag-based conditional requests (`If-None-Match`)
- ✅ Gzip compression (via `Accept-Encoding`)