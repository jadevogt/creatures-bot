FROM node:20-slim

WORKDIR /app

# Install ffmpeg with rubberband
RUN apt-get update && \
    apt-get install -y ffmpeg rubberband-cli librubberband2 && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production

COPY . .

CMD ["node", "src/index.js"]