FROM node:slim

WORKDIR /opt/qdrop
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
