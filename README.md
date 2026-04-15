# 📱 GenZ News

A mobile news app that rewrites trending articles in Gen Z language — making current affairs fun, digestible, and actually readable. Think InShorts meets brainrot.

---

## What it does

- Automatically fetches trending news every 4 hours from NewsAPI
- Rewrites each article in Gen Z language using Groq (Llama 3.1) — free AI
- Saves articles as `pending` until you review them
- Admin panel lets you approve or reject articles before they go live
- Mobile app shows approved articles as swipeable full-screen cards
- Tap any card to read more, or open the original source article

---

## Tech stack

| Layer | Tech |
|---|---|
| Mobile app | React Native + Expo |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| AI rewriter | Groq API — Llama 3.1 (free) |
| News source | NewsAPI (free tier) |
| Automation | node-cron (runs every 4 hrs) |
| Admin panel | React (web) |

---

## Project structure

```
genz-news/
├── apps/
│   ├── mobile/          ← React Native (Expo) mobile app
│   ├── backend/         ← Node.js + Express API + cron job
│   └── admin/           ← React web app for article approval
└── README.md
```

---

## Getting started

### Prerequisites

- Node.js 18+
- Expo Go app on your phone (iOS or Android)
- Free accounts at: [NewsAPI](https://newsapi.org), [Groq](https://groq.com), [Supabase](https://supabase.com)

---

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/genz-news.git
cd genz-news
```

---

### 2. Set up the database

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to the SQL editor and run:

```sql
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url_hash TEXT UNIQUE NOT NULL,
  original_title TEXT,
  original_url TEXT,
  original_source TEXT,
  genz_title TEXT,
  genz_summary TEXT,
  category TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 3. Set up the backend

```bash
cd apps/backend
npm install
```

Create a `.env` file:

```bash
NEWSAPI_KEY=your_newsapi_key
GROQ_API_KEY=your_groq_key
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
ADMIN_SECRET=choose_a_strong_password
PORT=3000
```

Start the server:

```bash
node index.js
```

On startup the pipeline runs immediately — it fetches articles, rewrites them with AI, and saves them as `pending`. You'll see logs in the terminal.

---

### 4. Publish articles via API

Fetch pending articles:

```bash
curl http://localhost:3000/api/articles/pending \
  -H "x-admin-token: your_admin_secret"
```

Publish all pending at once:

```bash
curl -X PATCH http://localhost:3000/api/articles/publish-all \
  -H "x-admin-token: your_admin_secret"
```

Publish a single article:

```bash
curl -X PATCH http://localhost:3000/api/articles/ARTICLE_ID \
  -H "Content-Type: application/json" \
  -H "x-admin-token: your_admin_secret" \
  -d '{"status": "published"}'
```

---

### 5. Set up the mobile app

```bash
cd apps/mobile
npm install
```

Find your Mac's local IP:

```bash
ipconfig getifaddr en0
```

Create a `.env` file:

```bash
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000/api
```

> Use your local IP, not `localhost` — your phone can't resolve localhost to your Mac.

Start Expo:

```bash
npx expo start --clear
```

Scan the QR code with Expo Go on your phone. Make sure your phone and Mac are on the same WiFi network.

---

## API reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/articles` | None | Fetch all published articles (mobile app) |
| GET | `/api/articles/pending` | Admin | Fetch articles awaiting review |
| PATCH | `/api/articles/:id` | Admin | Set status to `published` or `rejected` |
| PATCH | `/api/articles/publish-all` | Admin | Publish all pending articles at once |
| GET | `/health` | None | Server health check |

Admin routes require the `x-admin-token` header matching `ADMIN_SECRET` in your `.env`.

---

## How the automation pipeline works

```
Every 4 hours:
  1. Fetch top 20 trending articles from NewsAPI
  2. For each article — check if URL hash already exists in DB
  3. If duplicate → skip (saves AI costs)
  4. If new → send to Groq for Gen Z rewrite
  5. Save to DB with status = 'pending'
  6. You review in admin panel → approve or reject
  7. Approved articles appear in the mobile app
```

---

## Avoiding duplicate processing

Every article URL is hashed (MD5) and stored in the database with a unique constraint. Before calling the AI, the pipeline checks if the hash already exists and skips it if so. This means even if the cron job fetches overlapping articles across runs, you're never charged for the same article twice.

---

## Environment variables

### Backend (`apps/backend/.env`)

| Variable | Description |
|---|---|
| `NEWSAPI_KEY` | From newsapi.org — free tier |
| `GROQ_API_KEY` | From groq.com — free tier |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `ADMIN_SECRET` | Password for admin API routes |
| `PORT` | Server port (default 3000) |

### Mobile (`apps/mobile/.env`)

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Your backend URL e.g. `http://192.168.x.x:3000/api` |

---

## Cost estimate

Everything runs on free tiers for a personal project:

| Service | Cost |
|---|---|
| NewsAPI | Free (100 req/day) |
| Groq (Llama 3.1) | Free tier |
| Supabase | Free tier |
| Expo Go (development) | Free |
| Hosting (Railway/Render) | Free tier available |
| **Total** | **$0** |

---

## Troubleshooting

**Mobile app says "Is your backend running?"**
- Check your IP with `ipconfig getifaddr en0`
- Make sure phone and Mac are on the same WiFi
- Visit `http://your-ip:3000/health` in your phone's browser to verify connectivity
- Restart Expo with `npx expo start --clear` after changing `.env`

**Admin API returns 401 Unauthorized**
- Run `cat .env | grep ADMIN_SECRET` to see the exact value
- Watch for extra spaces or quotes in the `.env` value
- Restart the backend after any `.env` change

**AI rewrite errors in the terminal**
- Occasional JSON parse errors from the AI are normal — the pipeline skips that article and continues
- If all articles fail, check your `GROQ_API_KEY` is valid

**Articles not showing in the app**
- Make sure articles have `status = 'published'` in Supabase
- Use the `publish-all` curl command to bulk publish pending articles

---

## Built with

- [Expo](https://expo.dev) — React Native toolchain
- [Groq](https://groq.com) — Free, fast LLM inference
- [Supabase](https://supabase.com) — Open source Firebase alternative
- [NewsAPI](https://newsapi.org) — News aggregation API
- [node-cron](https://github.com/node-cron/node-cron) — Task scheduling

---

## License

MIT