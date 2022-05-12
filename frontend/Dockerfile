FROM node:alpine as base

# Fixes an issue with Vite.
# See: https://github.com/vitejs/vite/issues/6767#issuecomment-1050459865
WORKDIR /root

COPY package*.json .
RUN npm install --silent

# Fixes permission issue
# See: https://stackoverflow.com/a/67540612
RUN mkdir node_modules/.q-cache && chmod -R 777 node_modules/.q-cache

COPY shared ../shared
COPY . .

# Remove shared folder from working directory
RUN rm -rf shared

EXPOSE 9000


FROM base as dev
CMD [ "npx", "quasar", "dev" ]
