FROM node:22-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]