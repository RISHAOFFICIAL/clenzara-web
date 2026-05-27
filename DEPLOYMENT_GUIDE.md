# Clenzara.com – Deployment Guide

This guide walks the owner through final setup steps to launch Clenzara.com.

---

## Step 1: Set Up Google Apps Script Email Capture

### 1a. Create the Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it **"Clenzara Waitlist"** (or any name you prefer).
3. Rename the first sheet tab to **"Waitlist"** (right-click tab → Rename).

### 1b. Add Apps Script Backend
1. In the Google Sheet, go to **Extensions → Apps Script**.
2. A new browser tab opens with the Apps Script editor.
3. Delete any existing code in the editor (select all, delete).
4. Copy the entire contents of **`google-apps-script-backend.js`** from the shared folder and paste it into the editor.
5. **⚠️ CRITICAL**: Open `google-apps-script-backend.js` and replace `YOUR_EMAIL@HERE.COM` with your actual email address on line 15. This enables owner notifications when people sign up.
6. Click **Save** (Ctrl+S / Cmd+S).
7. Close the Apps Script editor tab.

### 1c. Deploy as Web App
1. Go back to the Google Sheet → **Extensions → Apps Script**.
2. Click **Deploy → New Deployment**.
3. Click the **Select type** gear icon ⚙️ and choose **Web app**.
4. Fill in:
   - **Description**: "Clenzara Email Capture"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
5. Click **Deploy**. If prompted, grant permissions (select your Google account, click "Allow"). Note: Google will warn about "unverified app" — this is expected for personal deployments. Click "Continue" and "Allow".
6. Copy the **Web App URL** that looks like:
   ```
   https://script.google.com/macros/s/XXXXXXXXXXXXXXX/exec
   ```
7. **Save this URL** — you'll need it for Step 2.

### What the backend does:
- Appends each email + timestamp to the "Waitlist" sheet
- Sends a **welcome email** to the subscriber immediately (using the MailApp service, no extra setup needed)
- Sends a **notification email** to you when someone new signs up

---

## Step 2: Update the Deployment URL in HTML (ALREADY DONE)

Note: We have already updated `index.html` and `clenzara-v3.html` with your URL:
`https://script.google.com/macros/s/AKfycbx3ue0Wyk6ombN9TTKZ8rZotHuQUdZI0wnhtu3wC6xOqAwrl47gV7DdbSSTrvqVOz9s/exec`

You can skip this step unless you deploy a *different* script in the future.

---

## Step 3: Update GA4 Measurement ID (ALREADY DONE)

Note: We have already updated `index.html` and `clenzara-v3.html` with your GA4 ID: **`G-GBZ5SW0PG9`**.

You do not need to edit the code. Simply verify that data is flowing in your Google Analytics dashboard once the site is live.

---

## Step 4: Upload Files to Hostinger

### Required Files
Upload these files to your Hostinger `public_html` or `www` folder:

| File | Description |
|------|-------------|
| `index.html` | Main landing page |
| `blog/` | Folder containing all 5 pillar blog posts |
| `assets/favicon_web.png` | Site favicon |
| `assets/logo_web.png` | Header logo |
| `assets/og-image.jpg` | Social share preview image |

### Asset Folder Structure on Hostinger
```
public_html/
├── index.html
├── blog/
│   ├── 17-signs-of-parasites-in-humans.html
│   ├── drainage-pathways.html
│   ├── full-moon-parasite-connection.html
│   ├── biofilm-disruptors.html
│   └── pro-app-conversion.html
└── assets/
    ├── favicon_web.png
    ├── logo_web.png
    └── og-image.jpg
```

---

## Step 5: Domain & DNS (Already Done If Site is Live)

If clenzara.com is already pointing to Hostinger, skip this step.
1. In Hostinger hPanel → **Domains** → point DNS A record to your hosting IP.
2. Allow up to 24-48 hours for DNS propagation.

---

## Step 6: Verify Everything Works

### Test Email Capture
1. Open clenzara.com in a browser.
2. Scroll to the waitlist form at the bottom.
3. Enter a test email and click "Join Waitlist".
4. You should see the success message immediately.
5. Check your Google Sheet — a new row should appear with the email and timestamp.
6. Check your email inbox — you should receive a welcome email from yourself.

### Test Amazon Links
1. Click any "Buy on Amazon" button — it should open the correct Amazon product page.
2. Verify the affiliate tag `clenzara-20` appears in the URL.

### Test Social Share Preview
1. Go to [Facebook Debugger](https://developers.facebook.com/tools/debug/) and paste your URL.
2. Click "Scrape" — you should see the OG image and title.
3. For Twitter, use [Twitter Card Validator](https://cards-dev.twitter.com/validator).

---

## Troubleshooting

### "Sorry, unable to open browser" when running Apps Script?
This is a known issue in some browser configurations. Try:
- Make sure you are logged into the same Google account that owns the sheet
- Run the script from within the Apps Script editor using the dropdown → Run function

### Email capture not working?
- Check browser console (F12 → Console) for errors.
- Make sure the Web App URL is exactly correct in Step 2.
- Re-deploy the Apps Script if you edited the code: Extensions → Apps Script → Deploy → Manage Deployments → ✏️ → Version (select new) → Deploy.

### "This app isn't verified" warning?
- This is normal for personal Google Apps Script deployments.
- Click "Continue" → "Go to [app name] (unsafe)" to allow access.
- For production use with many users, you'd need to go through Google's OAuth verification process.

### GA4 not tracking?
- Verify the Measurement ID is correct (G-XXXXXXXXXX format).
- Check the Network tab for the `collect?v=2` request after page load.
- Wait 24-48 hours for data to appear in GA4 dashboard.

### Social preview not showing image?
- Use Facebook Debugger and click "Scrape Again" to refresh the cached preview.
- Make sure `og-image.jpg` is uploaded to the `/assets/` folder on Hostinger.
- Check that `og:image` in the HTML points to `https://clenzara.com/assets/og-image.jpg`.

---

## Summary Checklist

- [ ] Google Sheet created with "Waitlist" tab
- [ ] `YOUR_EMAIL@HERE.COM` replaced with your real email in backend script
- [ ] Apps Script saved and deployed as Web App (Anyone access)
- [ ] Web App URL copied
- [ ] URL updated in `index.html` (YOUR_SCRIPT_ID replaced)
- [ ] GA4 Measurement ID updated in `index.html`
- [ ] `index.html` + `clenzara-v3.html` uploaded to Hostinger `public_html/`
- [ ] `assets/` folder uploaded with favicon.png, logo.png, og-image.jpg
- [ ] Email capture tested → appears in Google Sheet + welcome email sent
- [ ] Amazon links verified (clenzara-20 tag present)
- [ ] Social share preview tested (Facebook/Twitter)