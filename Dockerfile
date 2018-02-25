FROM node:alpine

ARG APP_DIR=/app
WORKDIR "$APP_DIR"

RUN mkdir data
COPY package.json package-lock.json $APP_DIR/
RUN npm install

COPY . $APP_DIR/

ENTRYPOINT ["npm"]