FROM node:alpine

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE  10000

ENTRYPOINT ["npx", "ng", "serve", "-c", "render", "--host", "0.0.0.0", "--port", "10000", "--disable-host-check"]