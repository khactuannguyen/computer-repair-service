# Step 1: Build the application
FROM node:20-alpine AS builder

# Install Python and build dependencies for native modules
RUN apk add --no-cache python3 make g++ py3-pip krb5-dev

# Set Python path for node-gyp
ENV PYTHON=/usr/bin/python3

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
COPY .env.public .env

RUN npm run build

# Step 2: Run the application
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install runtime dependencies for native modules
RUN apk add --no-cache python3 krb5

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
