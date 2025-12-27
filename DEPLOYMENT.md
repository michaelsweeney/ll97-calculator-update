# Deployment Guide

This guide covers deploying the NYC LL97 Calculator to various hosting platforms for client review.

## Quick Start - Deploy Now (Recommended)

The fastest way to deploy this app is using **Vercel** or **Netlify**. Both provide:
- Free hosting for public repositories
- Automatic HTTPS
- Instant public URLs
- CI/CD from Git
- No credit card required

---

## Option 1: Vercel (Recommended - Fastest)

### Prerequisites
- GitHub account (already have: https://github.com/michaelsweeney/ll97-calculator-update.git)
- Vercel account (free at https://vercel.com)

### Method A: Deploy via Vercel Dashboard (No CLI needed)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Go to Vercel**:
   - Visit https://vercel.com
   - Click "Sign Up" and use your GitHub account
   - Click "Add New Project"
   - Import your repository: `ll97-calculator-update`

3. **Configure Project**:
   - Framework Preset: **Other** (Vite is auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
   - Node Version: `20.x`

4. **Deploy**:
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app will be live at: `https://[project-name].vercel.app`

### Method B: Deploy via CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

   Or use the npm script:
   ```bash
   npm run deploy:vercel
   ```

4. **Follow prompts**:
   - Link to existing project or create new one
   - Your app will be deployed and URL will be displayed

---

## Option 2: Netlify

### Method A: Deploy via Netlify Dashboard (No CLI needed)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Go to Netlify**:
   - Visit https://netlify.com
   - Click "Sign Up" and use your GitHub account
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and authorize Netlify
   - Select your repository: `ll97-calculator-update`

3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Click "Deploy site"

4. **Get URL**:
   - Your app will be live at: `https://[random-name].netlify.app`
   - You can customize the subdomain in Site Settings

### Method B: Deploy via CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

   Or use the npm script:
   ```bash
   npm run deploy:netlify
   ```

---

## Option 3: GitHub Pages (Free, No Sign-up)

### Setup

1. **Install gh-pages package**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts**:
   ```json
   "homepage": "https://michaelsweeney.github.io/ll97-calculator-update",
   "scripts": {
     "predeploy": "npm run build",
     "deploy:gh-pages": "gh-pages -d build"
   }
   ```

3. **Update vite.config.ts** (add base path):
   ```typescript
   export default defineConfig({
     base: '/ll97-calculator-update/',
     // ... rest of config
   })
   ```

4. **Deploy**:
   ```bash
   npm run deploy:gh-pages
   ```

5. **Enable GitHub Pages**:
   - Go to GitHub repository settings
   - Pages → Source: Select `gh-pages` branch
   - Your app will be at: `https://michaelsweeney.github.io/ll97-calculator-update`

**Note**: GitHub Pages adds a base path which may require code changes if you use React Router.

---

## Option 4: Render (Free tier available)

1. **Go to Render**:
   - Visit https://render.com
   - Sign up with GitHub

2. **Create Static Site**:
   - Dashboard → "New" → "Static Site"
   - Connect your GitHub repository

3. **Configure**:
   - Build Command: `npm run build`
   - Publish Directory: `build`
   - Click "Create Static Site"

4. **Get URL**:
   - Your app will be at: `https://[app-name].onrender.com`

---

## Option 5: Cloudflare Pages

1. **Go to Cloudflare Pages**:
   - Visit https://pages.cloudflare.com
   - Sign up (free)

2. **Create Project**:
   - Connect to GitHub
   - Select repository

3. **Build Settings**:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `build`

4. **Deploy**:
   - Your app will be at: `https://[project-name].pages.dev`

---

## Troubleshooting

### Build Fails

If the build fails, check:
1. Node version is 20.x or higher
2. All dependencies are installed
3. TypeScript compilation succeeds locally: `npm run type-check`
4. Build works locally: `npm run build`

### Blank Page After Deployment

If you see a blank page:
1. Check browser console for errors
2. Ensure base path is correct (if using subdirectory deployment)
3. Check that SPA redirects are configured (all routes → index.html)

### 404 on Page Refresh

For React Router apps, ensure your hosting platform redirects all routes to `index.html`:
- **Vercel**: `vercel.json` already configured ✓
- **Netlify**: `netlify.toml` already configured ✓
- **GitHub Pages**: May need custom 404.html workaround

---

## Custom Domain (Optional)

All platforms above support custom domains:

1. **Buy domain** (Namecheap, Google Domains, etc.)
2. **In hosting platform**:
   - Go to domain settings
   - Add your custom domain
   - Copy DNS records

3. **In domain registrar**:
   - Add DNS records provided by hosting platform
   - Wait for DNS propagation (5-60 minutes)

---

## Recommended: Vercel

For this project, I recommend **Vercel** because:
- Zero configuration needed (auto-detects Vite)
- Instant deployments (< 1 minute)
- Automatic HTTPS
- Preview deployments for PRs
- Great performance (edge network)
- Free tier is generous
- Best Vite/React support

**Current Setup**: This repo is already configured for Vercel with `vercel.json`.

---

## Environment Variables (if needed)

If your app needs environment variables:

### Vercel
```bash
vercel env add VITE_API_KEY
```

### Netlify
```bash
netlify env:set VITE_API_KEY "your-value"
```

Or add via dashboard UI → Environment Variables

**Remember**: Vite requires `VITE_` prefix for environment variables!

---

## Next Steps After Deployment

1. Test the deployed URL thoroughly
2. Share URL with client
3. Set up automatic deployments from `main` branch
4. Consider adding a staging environment (deploy from `develop` branch)
5. Monitor performance with Web Vitals
