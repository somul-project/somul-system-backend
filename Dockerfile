FROM node:10.0.0-alpine AS build

# copy server code.
RUN mkdir /somul-server
WORKDIR /somul-server
ADD package.json /somul-server
ADD ./tsconfig.json /somul-server/tsconfig.json
RUN npm install 
RUN npm install -g typescript
ADD ./src /somul-server/src
WORKDIR /somul-server
RUN tsc

FROM node:10.0.0-alpine

RUN mkdir /somul-server
ADD package.json /somul-server
COPY --from=build /somul-server/dist /somul-server/dist
WORKDIR /somul-server
RUN npm install --only=prod

CMD ["node", "dist/index.js", "serve"]
