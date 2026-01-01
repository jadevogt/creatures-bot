FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
RUN apk add --no-cache ffmpeg rubberband-ladspa rubberband
COPY src/ ./src/

USER node

ENTRYPOINT ["npm"]
CMD ["start"] 
