FROM node
RUN apt-get update
RUN apt-get install vim -y
RUN npm install
CMD npm run start:dev
