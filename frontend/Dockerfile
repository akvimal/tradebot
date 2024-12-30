FROM node:18.19.1 as build
# # Create a Virtual directory inside the docker image
WORKDIR /app

# # Copy files from local machine to virtual directory in docker image
COPY package*.json ./

RUN npm install

# RUN npm install -g @angular/cli@12.0.0

COPY . .

EXPOSE 4300