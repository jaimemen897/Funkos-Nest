FROM node:16-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

#RUN npm run test
RUN cd node_modules
RUN ls
RUN cd ..
RUN npm run build

RUN npm prune --prod
RUN npm install --save-dev cross-env
RUN npm install -g cross-env

FROM node:16-alpine AS run

WORKDIR /app

COPY --from=build /app/node_modules/ /app/node_modules/

COPY --from=build /app/dist/ /app/dist/

COPY package*.json /app/

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start:prod"]