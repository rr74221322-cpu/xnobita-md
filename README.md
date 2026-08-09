# ꨄ 𝐗 𝐍𝐎𝐁𝐈𝐓𝐀 𝐌𝐃 ꨄ — WhatsApp Pairing Bot

**Owner:** 917337211743 | **Telegram:** t.me/Nobitaxudi

এই বট দিয়ে যেকোনো WhatsApp নম্বর Telegram bot-এর মাধ্যমে pair করা যায়। কোনো channel join চেক নেই — ইউজার সরাসরি pairing code পায়।

## 📁 ফোল্ডার স্ট্রাকচার

```
x-nobita-md/
├── index.js          # Main server (autoload + Telegram bot load)
├── bot.js            # Telegram bot (/pair, /unpair, /start)
├── pair.js           # Baileys pairing code generator
├── autoload.js       # পুরোনো paired sessions auto reconnect
├── token.js          # Telegram bot token
├── utils.js          # sleep helper
├── setting/
│   └── config.js     # Bot identity (নাম, footer, owner JID)
├── kingbadboitimewisher/
│   ├── admin.json
│   └── pairing/      # প্রতিটি pair হওয়া session এখানে save হয়
├── database/
├── media/            # বটের ছবি (nobita.jpg)
├── package.json
└── README.md
```

## 🚀 সেটআপ (Termux / VPS)

### ১. Node.js install করুন
```bash
pkg update -y && pkg upgrade -y
pkg install nodejs -y
```

### ২. প্রজেক্ট ফোল্ডারে গিয়ে dependencies install করুন
```bash
cd x-nobita-md
npm install
```
(VPS-এ: `npm install --omit=dev`)

### ৩. Media ছবি host করুন
`media/nobita.jpg` ছবিটি [postimg.cc](https://postimg.cc) বা [catbox.moe](https://catbox.moe)-তে আপলোড করুন, তারপর `bot.js`-এ এই লাইনে নতুন link দিন:
```js
"https://i.postimg.cc/xNOBITA/nobita-md.png"   ← আপনার আপলোড করা ছবির link দিন
```

### ৪. বট রান করুন
```bash
node index.js
```
বা PM2 দিয়ে background-এ রান করুন (recommended):
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 logs x-nobita-md
pm2 save
pm2 startup
```

## ⚙️ কাস্টমাইজ

| কী edit করবেন | ফাইল | কী আছে |
|---|---|---|
| বটের নাম/owner JID | `setting/config.js` | BOT_NAME, creator, ownernumber |
| Telegram token | `token.js` | BOT_TOKEN |
| Owner Telegram link | `bot.js` | t.me/Nobitaxudi |
| Owner name / Telegram link (database message) | `setting/config.js` | global.database |
| বটের thumbnail ছবি | `bot.js` | /start command-এর image URL |

## 📱 WhatsApp Command System

বটে এখন **১৮৯টা command** যোগ করা হয়েছে। Prefix: `.` (বা #, !, /)

| Category | Commands |
|---|---|
| Core | .menu .gmenu .list .alive .ping .uptime .btpn .owner |
| AI | .copilot .gpt .achar .aquote .arecommend .asearch |
| Downloader | .play .song .yta .ytmp3 .yts .fb .ig .pint .mega .apk .git .gitclone .url |
| Sticker | .sticker .s .take .toimage .sticker2img .video2img .vs .remini |
| Group | .kick .add .promote .demote .warn .tagall .hidetag .antilink .antibot .welcome .goodbye .poll ইত্যাদি |
| Fun/Anime | .neko .waifu .megumin .shinobu .loli .maid .anime .manga .hug .kiss .slap ইত্যাদি |
| Search | .wiki .lyrics .weather .yts |
| Owner Tools | .mode .public .private .setbio .setname .setpp .block .broadcast .join .leaveall .listgc ইত্যাদি |
| Utilities | .trt .calc .qr .shorturl .ssweb |

নিজের নম্বর (917337211743) owner — সব command ব্যবহার করতে পারবে। `.mode self` দিলে বাকিদের command ব্যবহার বন্ধ হবে।

## 📱 ব্যবহার (Telegram-এ)

- `/start` → বটের welcome message + ছবি
- `/pair 917337211743` → pairing code generate করে
- প্রত্যুত্তর না দিয়ে শুধু নম্বর পাঠালেও পায়
- `/unpair 917337211743` → pair করা session মুছে ফেলে

## ⚠️ নোট

- Pairing code **২ মিনিট**ে expire হয়ে যায়
- একই Telegram token দিয়ে একসাথে দুটো বট চালানো যায় না
- বট hosting-এ 24/7 রান করতে পারলে session-গুলো always-connected থাকবে
