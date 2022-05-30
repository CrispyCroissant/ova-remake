FROM node:alpine as base

WORKDIR /backend

# Install node modules
COPY package*.json ./
RUN npm install --silent

# Copy all necessary files to image
COPY . ./
COPY shared ../shared

# Remove unused folder from image root
RUN rm -rf shared

RUN npx prisma generate
RUN npm run build

EXPOSE 3000