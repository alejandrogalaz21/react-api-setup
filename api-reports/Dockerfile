FROM node:alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install

COPY . .

EXPOSE 5488

CMD ["npm", "start"]