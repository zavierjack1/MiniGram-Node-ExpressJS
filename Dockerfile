FROM node
RUN apt-get update
RUN apt-get install vim -y
RUN npm update
#RUN npm install --save express
#RUN npm install --save body-parser
#RUN npm install --save mongoose