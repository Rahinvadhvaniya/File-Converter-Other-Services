# Deployment Guide

## Vercel (Recommended)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/file-converter)

### Manual Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Set environment variables (see below)
4. Click **Deploy**

---

## Environment Variables

Set these in Vercel dashboard → Project → Settings → Environment Variables:

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Google AdSense publisher ID | No |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments | No |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | No |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | No |
| `NEXTAUTH_SECRET` | Random secret for NextAuth | No |
| `NEXTAUTH_URL` | Your production URL | No |

---

## Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/file-converter
cd file-converter

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

```bash
npm run build
npm start
```

---

## Production Checklist

- [ ] Set `NEXTAUTH_URL` to your production domain
- [ ] Generate a strong `NEXTAUTH_SECRET` (`openssl rand -base64 32`)
- [ ] Configure Stripe keys if enabling payments
- [ ] Add AdSense client ID if monetizing
- [ ] Ensure `uploads/` and `outputs/` directories have write permissions
- [ ] Review `vercel.json` function timeout settings (default: 30s)
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up custom domain in Vercel dashboard

---

## Notes

- Uploaded files are automatically deleted after 1 hour
- Maximum file size is 50MB
- All 12 conversion tools work server-side without external services
