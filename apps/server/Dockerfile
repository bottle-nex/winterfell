FROM node:20-bullseye-slim

WORKDIR /app

COPY package.json yarn.lock turbo.json ./
COPY apps/server/ ./apps/server/
COPY packages/ ./packages/

# Create a minimal workspace just for server dependencies
RUN echo '{"name": "server-docker", "private": true, "workspaces": ["apps/server", "packages/*"]}' > package.json

RUN yarn --frozen-lockfile

WORKDIR /app/packages/database
RUN npx prisma generate


WORKDIR /app/apps/server
RUN yarn build

EXPOSE 8787

CMD ["yarn", "start"]