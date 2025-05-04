FROM node:18-alpine

WORKDIR /.

COPY package*.json ./
COPY package-lock*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]



