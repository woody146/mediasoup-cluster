FROM node:18.16.0

# Install DEB dependencies and others.
RUN \
    set -x \
    && apt-get update \
    && apt-get install -y net-tools build-essential python3 python3-pip valgrind

WORKDIR /service

COPY package.json .
COPY tsconfig.json .
COPY src ./src

RUN npm install
RUN npm run build

EXPOSE 20000-40000
