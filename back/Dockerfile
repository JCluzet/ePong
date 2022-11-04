FROM	node:17-alpine3.14

RUN		npm i -g @nestjs/cli

WORKDIR	/app

COPY	./package.json ./
COPY	./package-lock.json ./
COPY	./tsconfig* ./

RUN		npm install --force

COPY	./ ./

EXPOSE	5000

CMD		npm run start:dev