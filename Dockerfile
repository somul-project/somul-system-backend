FROM ubuntu:18.04

RUN apt-get update
# install nodeJS and npm.
RUN apt-get install -y \
        nodejs \
        curl \
        npm

# install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install -y yarn


# copy ain-v1-worker code.
RUN mkdir /somul-server
ADD package.json /somul-server
ADD ./src /somul-server/src
ADD ./tsconfig.json /somul-server/tsconfig.json
ADD ./jest.config.js /somul-server/jest.config.js

WORKDIR /somul-server
RUN yarn

CMD ["yarn", "start"]