FROM node:12

# Create App directory
WORKDIR /codica/src/app


COPY package*.json ./

RUN npm install

# Bundle app src
COPY . .

RUN npm run build

EXPOSE 8080
CMD ["node", "dist/main"]