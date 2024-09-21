FROM node:alpine

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE  4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--disable-host-check"]