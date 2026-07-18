# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app


# Cache dependency layer independently of source changes
COPY package.json package-lock.json ./


RUN npm install

COPY . .

RUN npm run build


# ── Stage 2: production ────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Remove defaults
RUN rm -rf /usr/share/nginx/html/* \
    && rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/app.conf

COPY --from=builder /app/dist /usr/share/nginx/html

# nginx master runs as root (required to bind port 80); workers drop to nginx user automatically
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
