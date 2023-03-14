FROM node:18-alpine as build
WORKDIR /frontend
ADD *.json ./
RUN npm install
ARG REACT_APP_HOST_IP_ADDRESS
ENV REACT_APP_HOST_IP_ADDRESS $REACT_APP_HOST_IP_ADDRESS
ADD ./public ./public
ADD ./src ./src