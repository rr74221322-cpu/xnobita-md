# 🚂 Railway-তে X NOBITA MD বট রান করার গাইড

Railway হচ্ছে একটা cloud hosting platform — এখানে বট দিলে 24/7 online থাকবে, ফোন বন্ধ করলেও!

---

## ধাপ ১: GitHub Repository বানানো

Railway সরাসরি GitHub থেকে code pull করে।

1. [github.com](https://github.com)-এ গিয়ে login করুন (না থাকলে free account বানান)
2. **New Repository** → নাম: `xnobita-md` → **Public** সিলেক্ট করুন → Create
3. MT Manager দিয়ে আপনার ফোনে ফাইল বানানো মুশকিল, তাই সবচেয়ে সহজ উপায়: **Manus-এর দেওয়া ZIP extract করে ফাইলগুলো GitHub-এ আপলোড করুন**
   - Repository-এ **Add file → Upload files** → সব ফাইল সিলেক্ট করে কমিট করুন
   - ⚠️ `node_modules` ফোল্ডার আপলোড করবেন না!

## ধাপ ২: Railway Project বানানো

1. [railway.com](https://railway.com) → Google দিয়ে login (free plan)
2. **New Project** → **Deploy from GitHub repo** → `xnobita-md` সিলেক্ট করুন
3. Railway অটো সনাক্ত করবে — **Settings → Source** থেকে `railway.json` দেখাচ্ছে কিনা চেক করুন

## ধাপ ৩: Environment Variables সেট করা

Railway dashboard → **Variables** → এইগুলো দিন:

| Variable | Value |
|---|---|
| `BOT_TOKEN` | `8808390577:AAELprRXx7Uf0If-o8DERsgNa2iKdeDi7Q8` |
| `NODE_VERSION` | `20` |

(নতুন Telegram token নিলে `BOT_TOKEN` বদলে দিন)

## ধাপ ৪: Deploy

- Railway অটো build করবে (Dockerfile) → ৫-১০ মিনিট লাগতে পারে
- **Logs** ট্যাবে দেখুন: `X NOBITA MD system is ready` আসলে সফল

## ধাপ ৫: Pair করা

1. Telegram → আপনার বটে `/pair 917337211743` লিখুন
2. WhatsApp pairing code আসবে → WhatsApp → Linked Devices → Pair
3. session permanentlly Railway-এ সেভ থাকবে

---

## ⚠️ গুরুত্বপূরণ নোট

- Railway free plan-এ ৫০০ ঘণ্টা/মাস — একটা বটের জন্য যথেষ্ট, কিন্তু **30 days inactivity-তে suspend** হতে পারে। মাসে একবার dashboard-এ ঢুকে Active করুন।
- Dockerfile-এ **ffmpeg + webp** ইনস্টল হয়ে যাবে → sticker কাজ করবে
- `token.js` এখন Railway-এর `BOT_TOKEN` env variableও সমর্থন করে
- বট crash হলে Railway অটো restart করবে (`ON_FAILURE` policy)

## Problem হলে

- Logs-এ error দেখে আমাকে পাঠান — fix করে দেব!
