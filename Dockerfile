FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

USER node

ENTRYPOINT ["npm"]
CMD ["start"] 
