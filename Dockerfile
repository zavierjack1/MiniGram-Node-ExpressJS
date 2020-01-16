FROM node
RUN apt-get update
RUN apt-get install vim -y
RUN npm update
RUN npm install --save express