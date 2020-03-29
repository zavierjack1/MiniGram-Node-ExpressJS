FROM node
RUN apt-get update
RUN apt-get install vim -y
#COPY . /NodeJS-Express
#WORKDIR /NodeJS-Express
RUN npm install
CMD npm run start:dev
