FROM node:20-slim

# Install ffmpeg and webp tools for sticker support
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg webp && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production --ignore-scripts

COPY . .

# Keep-alive: ensure the process stays alive on Railway
CMD ["node", "index.js"]
