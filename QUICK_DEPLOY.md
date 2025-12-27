# 🚀 Quick Deploy - Get Client URL in 5 Minutes

## Option 1: Vercel (Easiest - No CLI needed)

### Steps:

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Go to Vercel**:
   - Visit: https://vercel.com
   - Click "Sign Up" → Use your GitHub account
   - Click "Add New Project"
   - Find and import: `ll97-calculator-update`

3. **Click Deploy** (that's it!)
   - Vercel auto-detects everything
   - Wait ~90 seconds
   - Copy your URL: `https://ll97-calculator-update.vercel.app`

4. **Share with client**
   - Every push to `main` auto-deploys
   - Preview URLs for pull requests

---

## Option 2: Netlify (Also Easy)

### Steps:

1. **Commit and push** (same as above)

2. **Go to Netlify**:
   - Visit: https://netlify.com
   - Sign up with GitHub
   - "Add new site" → "Import existing project"
   - Choose GitHub → Select `ll97-calculator-update`

3. **Settings** (auto-filled from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `build`
   - Click "Deploy site"

4. **Your URL**: `https://[random-name].netlify.app`
   - Customize name in site settings

---

## What I've Already Set Up For You

✅ **vercel.json** - Vercel configuration (SPA routing, build settings)
✅ **netlify.toml** - Netlify configuration (redirects, Node version)
✅ **package.json** - Added deploy scripts
✅ **Build tested** - Production build works (548 KB total)
✅ **Documentation** - See DEPLOYMENT.md for advanced options

---

## Files Added:

```
vercel.json          - Vercel deployment config
netlify.toml         - Netlify deployment config
DEPLOYMENT.md        - Complete deployment guide
QUICK_DEPLOY.md      - This file
```

---

## No Code Changes Required

The app is **ready to deploy as-is**:
- ✓ Build configuration optimized
- ✓ SPA routing configured for both platforms
- ✓ Node version specified (20.x)
- ✓ Output directory set to `build/`
- ✓ All dependencies compatible

---

## Recommended: Vercel

**Why Vercel?**
- Zero configuration (auto-detects Vite)
- Fastest deployment (~60 seconds)
- Best performance (edge network)
- Automatic HTTPS
- Free tier is generous
- Preview deployments for PRs

---

## After Deployment

Share this with your client:
- **URL**: `https://your-app.vercel.app` (or netlify.app)
- **Auto-updates**: Every push to `main` redeploys
- **Performance**: Optimized for speed
- **HTTPS**: Automatic SSL certificate

---

## Need Help?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- CLI deployment methods
- Alternative platforms (Render, Cloudflare, GitHub Pages)
- Custom domains
- Environment variables
- Troubleshooting

---

## 📝 Quick Checklist

- [ ] Push code to GitHub
- [ ] Sign up for Vercel/Netlify (with GitHub)
- [ ] Import repository
- [ ] Click deploy
- [ ] Copy public URL
- [ ] Share with client
- [ ] ✨ Done!
