FROM	node:17-alpine3.14

WORKDIR	/app

COPY	./package.json ./
COPY	./package-lock.json ./

RUN		npm install --force

COPY	./ ./

RUN		npm run build

EXPOSE	3000

CMD		npx serve -s build -l 3000