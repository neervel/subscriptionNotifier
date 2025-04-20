FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

RUN npm run build

CMD ["npm", "start"]
CMD ["npm", "run", "start:bot"]


