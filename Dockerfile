FROM node:alpine as builder

RUN apk update && apk add --no-cache make git
COPY . /app
WORKDIR /app
ARG API_URL="/api"
RUN sed -i "s!API_URL!$API_URL!g" /app/src/environments/environment.prod.ts && \
    cat /app/src/environments/environment.prod.ts && \
    cd /app && \
    npm set progress=false && \
    npm install && \
    npm run build-prod

# STEP 2 build a small nginx image with static website
FROM nginx:alpine
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
## From 'builder' copy website to default nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
