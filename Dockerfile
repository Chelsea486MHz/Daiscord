FROM node:18-alpine

# Configure app directory
RUN mkdir -p /home/node/app/node_modules && \
    chown -R node:node /home/node/app
WORKDIR /home/node/app

# Application settings
EXPOSE 8080

# Install dependencies
COPY package*.json ./
RUN npm install

# Install application
COPY --chown=node:node ./src/app.js app.js

# Run it
USER node
CMD [ "node", "app.js" ]