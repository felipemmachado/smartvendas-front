### Multi Stage Build ###

### Estágio 1 - Obter o source e gerar o build ###
FROM node:16.15.0 AS builder
#ENV NODE_ENV=production

WORKDIR /app

COPY . /app
RUN npm install
RUN npm run build

# # # ### Estágio 2 - Subir o source para o servidor NGINX com a app ###
FROM nginx:1.18.0-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./entrypoint.sh /usr/share/nginx/
RUN chmod +x /usr/share/nginx/entrypoint.sh


EXPOSE 80

ENTRYPOINT ["/usr/share/nginx/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
