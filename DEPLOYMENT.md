# Deployment Guide - FileConverter

This guide covers deploying your FileConverter application to various platforms.

## 🚀 Recommended: Vercel Deployment (Easiest & Free)

Vercel is the recommended platform for deploying Next.js applications. It offers:
- **Zero configuration** deployment
- **Free tier** with generous limits
- **Automatic HTTPS** and CDN
- **Automatic deployments** from GitHub
- **Preview deployments** for pull requests

### Step-by-Step Deployment to Vercel

#### 1. Prepare Your Repository

Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Deploy to Vercel

**Option A: Using Vercel Dashboard (Recommended for beginners)**

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository: `Rahinvadhvaniya/File-Converter-Other-Services`
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
6. Add Environment Variables (optional for now):
   - Click "Environment Variables"
   - Add variables from `.env.example` as needed
7. Click "Deploy"
8. Wait 2-3 minutes for deployment to complete
9. Your site will be live at: `https://your-project-name.vercel.app`

**Option B: Using Vercel CLI**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name? **file-converter-services**
   - Directory? **./`**
   - Override settings? **No**

5. Deploy to production:
```bash
vercel --prod
```

#### 3. Configure Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. SSL certificate will be automatically provisioned

#### 4. Set Up Environment Variables

For monetization features, add these in Vercel Dashboard:

1. Go to "Settings" → "Environment Variables"
2. Add required variables:

```env
# Google AdSense
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-your-id

# Stripe (when ready)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
```

#### 5. Enable Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

No additional configuration needed!

---

## 🌐 Alternative: Google Cloud Run Deployment

For more control and scalability, deploy to Google Cloud Run:

### Prerequisites
- Google Cloud account
- `gcloud` CLI installed
- Docker installed

### Step-by-Step

1. **Create a Dockerfile**:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

2. **Update next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Required for Docker
}

module.exports = nextConfig
```

3. **Build and Deploy**:
```bash
# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Build container
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/fileconverter

# Deploy to Cloud Run
gcloud run deploy fileconverter \
  --image gcr.io/YOUR_PROJECT_ID/fileconverter \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi
```

### Cost Estimate (Google Cloud Run)
- First 2 million requests: **FREE**
- After: ~$0.40 per million requests
- Memory: ~$0.0000025 per GB-second
- **Estimated monthly cost**: $5-50 depending on traffic

---

## 🔥 Alternative: Firebase Hosting

Good for static sites with Cloud Functions for API routes.

### Setup

1. **Install Firebase CLI**:
```bash
npm install -g firebase-tools
firebase login
```

2. **Initialize Firebase**:
```bash
firebase init hosting
```

3. **Configure firebase.json**:
```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

4. **Build and Deploy**:
```bash
npm run build
firebase deploy --only hosting
```

**Note**: For full Next.js features, use Vercel or Cloud Run instead.

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Built-in)
- Automatically enabled on Vercel
- View in Dashboard → Analytics
- Real user metrics

### Google Analytics
Add to `app/layout.tsx`:
```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

---

## 💰 Monetization Setup

### 1. Google AdSense Integration

1. Apply for AdSense at [google.com/adsense](https://www.google.com/adsense)
2. Get your publisher ID (ca-pub-xxxxxx)
3. Add to `.env.local`:
```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxx
```
4. Ad components will automatically use this ID

### 2. Stripe Payment Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard
3. Add to Vercel environment variables
4. Create products and pricing in Stripe Dashboard
5. Update pricing page with product IDs

---

## 🔒 Security Checklist

Before going to production:

- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Add CSP headers
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Add file size limits
- [ ] Implement file type validation
- [ ] Set up automated backups
- [ ] Enable error tracking (Sentry)
- [ ] Add security headers

---

## 📈 Performance Optimization

- [ ] Enable Next.js Image Optimization
- [ ] Add caching headers
- [ ] Implement CDN for static assets
- [ ] Use lazy loading for images
- [ ] Minimize bundle size
- [ ] Enable compression

---

## 🆘 Troubleshooting

### Build Fails on Vercel
- Check Node.js version in `package.json`
- Ensure all dependencies are in `dependencies` not `devDependencies`
- Check build logs for errors

### API Routes Not Working
- Ensure you're not using `output: 'export'` in next.config.js
- API routes require server-side rendering

### Large File Uploads Failing
- Check Vercel limits (4.5MB for Hobby plan, 4.5MB for function payloads)
- Consider using direct S3/Cloud Storage uploads for large files

---

## 📞 Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Issues**: Open an issue on GitHub

---

## 🎉 You're Live!

After deployment:
1. Test all features on production
2. Set up monitoring
3. Configure custom domain
4. Add monetization
5. Start marketing!

**Your site is now live and ready to earn! 🚀**
