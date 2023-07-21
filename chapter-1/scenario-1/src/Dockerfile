FROM nginx:alpine

WORKDIR /srv

RUN apk update && apk add bash

COPY static/ static/

COPY ./nginx.conf /etc/nginx/nginx.conf