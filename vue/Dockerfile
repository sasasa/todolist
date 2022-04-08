FROM node:10.16.3-alpine

WORKDIR /app

RUN apk update && \
    apk add git && \
    apk add --no-cache curl && \
    curl -o- -L https://yarnpkg.com/install.sh | sh

ENV PATH $HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH
# apk add openjdk8 && \ ここが上手くいかない


# ホットリロード
ENV CHOKIDAR_USEPOLLING=true
RUN yarn global add @vue/cli

RUN mkdir -p /app
WORKDIR /app
COPY ./package.json /app/package.json
COPY . /app
RUN yarn

EXPOSE 8080

CMD ["/bin/sh"]



# docker-machine ip default
# 192.168.99.100
# docker-compose build


# docker-compose run front yarn test:unit

# docker-compose up -d

# docker-compose run front yarn
# docker-compose exec front sh

# 192.168.99.100:3000

# docker-compose ps

# docker-compose stop↓
# docker-compose start↑

# docker-compose down -v