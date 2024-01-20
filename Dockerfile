FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY ./cert /app/cert
COPY . .
COPY .env .env
COPY .env.prod .env.prod
RUN ls -a

#RUN npm run test
RUN npm run build

RUN npm prune --prod
RUN npm install --save cross-env
RUN npm install -g cross-env

FROM node:16-alpine AS run

WORKDIR /app

COPY --from=build /app/node_modules/ /app/node_modules/

COPY --from=build /app/dist/ /app/dist/

COPY package*.json /app/

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:prod"]