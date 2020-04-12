#minigrame_node_express
FROM node
COPY ./ /NodeJS-Express/
WORKDIR /NodeJS-Express
RUN apt-get update
RUN apt-get install vim -y
RUN npm install
CMD npm run start
