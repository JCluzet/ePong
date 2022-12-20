FROM	node:17-alpine3.14

WORKDIR	/app

COPY	./package.json ./
COPY	./package-lock.json ./

RUN		npm install --force

COPY	./ ./

EXPOSE	3000

CMD		npm run start