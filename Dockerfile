FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
ENV NODE_ENV=development
RUN npm install --legacy-peer-deps
COPY index.html index.tsx App.tsx types.ts vite.config.ts tsconfig.json metadata.json ./
COPY components/ ./components/
COPY services/ ./services/
COPY env.d.ts ./
RUN npm run build

FROM nginx:alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
