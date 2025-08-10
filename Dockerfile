FROM node:24-alpine3.21

WORKDIR /app

# Install the application dependencies
COPY package.json .
RUN npm install


COPY . .
EXPOSE 5000

CMD ["npm", "start"]