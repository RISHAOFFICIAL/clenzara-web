# Clenzara.com — Connect GitHub to Hostinger (Auto-Deploy Guide)

Once the launch files are pushed to GitHub, connect the repository to Hostinger for automatic deployments.

## Prerequisites

- ✅ Your GitHub repository `RISHAOFFICIAL/clenzara-web` has been pushed with all launch files
- ✅ You have a Hostinger hosting account with clenzara.com pointed to it

---

## Method 1: Hostinger Git Integration (Recommended)

Hostinger hPanel has built-in Git support that can auto-deploy from GitHub.

### Step 1: Access Hostinger hPanel

1. Log in to your [Hostinger account](https://hpanel.hostinger.com/)
2. Select the hosting plan for clenzara.com
3. Look for **"Git"** or **"Git Integration"** in the sidebar menu

### Step 2: Connect Your Repository

1. In the Git section, click **"Connect Repository"**
2. Choose **"GitHub"** as the provider
3. Click **"Authorize"** to connect your GitHub account (you'll be redirected to GitHub)
4. Select the repository: `RISHAOFFICIAL/clenzara-web`
5. Select the branch: `main`
6. Set the **Deploy Path** to: `public_html` (or `www` depending on your setup)
7. Click **"Connect"**

### Step 3: Enable Auto-Deploy

1. Toggle **"Auto Deploy"** to **ON**
2. This means every time you push to the `main` branch, Hostinger will automatically pull the changes

### Step 4: Manual Deployment (First Time)

1. After connecting, click **"Deploy"** to pull the files for the first time
2. Wait for the deployment to complete
3. Visit `https://clenzara.com` to verify the site loads

---

## Method 2: Manual Deployment via FTP

If Git integration isn't available on your Hostinger plan:

### Step 1: Get FTP Credentials from Hostinger

1. In Hostinger hPanel → **"FTP"** or **"FTP Accounts"**
2. Create an FTP account or use the main account
3. Note the: Hostname, Username, Password, Port (usually 21)

### Step 2: Download from GitHub (as ZIP)

1. Go to `https://github.com/RISHAOFFICIAL/clenzara-web`
2. Click the green **"Code"** button → **"Download ZIP"**
3. Extract the ZIP file on your computer

### Step 3: Upload via FTP

1. Use an FTP client (FileZilla, Cyberduck, or Hostinger's built-in File Manager)
2. Connect using your FTP credentials
3. Navigate to `public_html/` or `www/`
4. Upload all files maintaining the folder structure:

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
    ├── og-image.jpg
    └── products/
        ├── bentonite.jpg
        ├── black_walnut.jpg
        ├── de.jpg
        ├── glutamine.jpg
        ├── magnesium.jpg
        └── serrapeptase.jpg
```

---

## Method 3: GitHub Actions → Hostinger (Advanced)

For full CI/CD with GitHub Actions:

### Step 1: Get Hostinger Deployment Credentials
- FTP/SFTP hostname, username, password from Hostinger hPanel

### Step 2: Add Secrets to GitHub

1. Go to `https://github.com/RISHAOFFICIAL/clenzara-web/settings/secrets/actions`
2. Click **"New repository secret"**
3. Add these secrets:
   - `FTP_HOST` — your Hostinger FTP hostname
   - `FTP_USERNAME` — your FTP username
   - `FTP_PASSWORD` — your FTP password

### Step 3: Create GitHub Actions Workflow

A pre-configured GitHub Actions workflow (`deploy-to-hostinger.yml`) is included in the `.github/workflows/` directory of the repository. It will:

- Trigger on every push to `main`
- Upload changed files via FTP/SFTP to your Hostinger server
- Verify the deployment with a health check

---

## Verifying the Connection

After deployment, verify everything works:

1. **Visit** https://clenzara.com — the page should load
2. **Check** a blog page — e.g., https://clenzara.com/blog/17-signs-of-parasites-in-humans.html
3. **Test** the waitlist email form at the bottom of the page
4. **Check** assets load — right-click → Inspect Element → Network tab
5. **Amazon links** — click a product → verify `tag=clenzara-20` in URL

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Site shows "Index of /" or blank | Files not in correct folder — ensure they're in `public_html/` or `www/` |
| 404 errors for blog pages | Missing blog folder — upload the full `blog/` directory |
| Images not loading | Check asset paths — they should be relative (`assets/logo_web.png`) |
| Auto-deploy not working | Re-authorize GitHub in Hostinger hPanel Git settings |
| "Failed to deploy" in Hostinger | File size limit exceeded — check Hostinger plan limits |