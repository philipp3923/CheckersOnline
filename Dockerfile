# Dockerfile
FROM node:16.17.0

WORKDIR /app

COPY . /app

RUN chmod +x install.sh
RUN ./install.sh

EXPOSE 3000
CMD cd server && npm run start