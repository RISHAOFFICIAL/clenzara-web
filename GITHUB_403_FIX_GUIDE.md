# Clenzara.com — GitHub 403 Forbidden Error Fix Guide

## Problem Identified

When attempting to push the Clenzara launch files to the GitHub repository `RISHAOFFICIAL/clenzara-web`, the following error occurs:

```
remote: Permission to RISHAOFFICIAL/clenzara-web.git denied to RISHAOFFICIAL.
fatal: unable to access 'https://github.com/RISHAOFFICIAL/clenzara-web.git/': The requested URL returned error: 403
```

## Root Cause

The Personal Access Token (PAT) provided (`github_pat_...`) is a **Fine-Grained PAT** that:

✅ **Can read** your user info and list repositories (REST API reads work)
✅ **Has admin access** to the repo at the API level
❌ **Lacks the "Contents: Write" permission** needed for `git push` operations and the Repository Contents API

**Key discovery:** Fine-Grained PATs (tokens starting with `github_pat_`) require separate permissions for different types of operations. The token you have can read repository metadata but cannot write any files or push code. Both `git push` and the GitHub Contents API returned `403` errors.

## How to Fix (Two Options)

### Option 1: Create a New Classic PAT (Recommended — Simplest)

1. Go to **GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)**
   - Direct link: https://github.com/settings/tokens
   
2. Click **"Generate new token (classic)"**

3. Give it a name like `clenzara-web-push`

4. Set **Expiration** to your preference (e.g., "No expiration" or "90 days")

5. Under **Scopes**, select **only** the following:
   - ☑️ **`repo`** — Full control of private repositories
   - *(If the repo is public, select only **`public_repo`** instead of full `repo`)*
   
   ![image](https://docs.github.com/assets/cb-30463/mw-1440/images/help/settings/token-scopes.webp)

6. Click **"Generate token"**

7. **Copy the token immediately** (GitHub shows it only once)

8. Use this new token with the following command:
   ```bash
   cd /home/team/shared/clenzara_launch
   git remote set-url origin "https://<YOUR_USERNAME>:<NEW_CLASSIC_TOKEN>@github.com/RISHAOFFICIAL/clenzara-web.git"
   git push -u origin main
   ```

### Option 2: Update the Existing Fine-Grained PAT

1. Go to **GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens**
   - Direct link: https://github.com/settings/tokens?type=beta

2. Click on the existing `github_pat_...` token

3. Under **Repository permissions**, find **"Contents"** and change it from **"Read"** to **"Read and Write"**

4. Click **"Save changes"**

5. Try pushing again:
   ```bash
   cd /home/team/shared/clenzara_launch
   git push -u origin main
   ```

## Local Repository Status (Already Prepared)

The local repository at `/home/team/shared/clenzara_launch/` is fully prepared with:

| File | Description |
|------|-------------|
| `index.html` | Main landing page (50KB, complete) |
| `blog/` | 5 pillar blog posts (parasites, biofilm, drainage, moon cycle, pro app) |
| `assets/` | Logo, favicon, OG image, 6 product images |
| `google-apps-script-backend.js` | Email capture backend (replace YOUR_EMAIL) |
| `DEPLOYMENT_GUIDE.md` | Step-by-step deployment guide |

The repo has **1 commit** ready to push:
```
b092915 — "initial launch files with optimized product images"
```

## Verifying the Fix

After updating the token, verify it works:

```bash
# Check authentication with new token
curl -s -H "Authorization: Bearer <YOUR_NEW_TOKEN>" https://api.github.com/user

# Push to GitHub
cd /home/team/shared/clenzara_launch
git push -u origin main
```

Once pushed successfully, proceed to connect GitHub to Hostinger (see `GITHUB_HOSTINGER_CONNECT_GUIDE.md`).