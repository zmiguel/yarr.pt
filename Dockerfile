FROM node:16

# Create app directory
WORKDIR /yarr.pt

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY src .

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]