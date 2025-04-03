FROM node as builder
WORKDIR '/usr/app'
COPY package.json .
RUN npm config set registry https://registry.npmmirror.com \
    && mkdir -p node_modules/.cache \
    && chmod -R 777 node_modules/.cache \
    && npm install 
COPY . .
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/app/build /usr/share/nginx/html