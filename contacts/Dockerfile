FROM node:latest

WORKDIR /app

COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
COPY . .

RUN "node_modules/@angular/cli/bin/ng" test --watch=false --browsers=ChromeHeadless

EXPOSE 8080

CMD ["node_modules/@angular/cli/bin/ng", "serve", "--port", "8080", "--host", "0.0.0.0"]
