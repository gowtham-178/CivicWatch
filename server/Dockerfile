FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production \
    PORT=5000

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p uploads && chown -R node:node /app

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-5000}/api/status || exit 1

CMD ["node", "src/index.js"]