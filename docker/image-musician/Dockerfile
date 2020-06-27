FROM node:12.16.3

RUN apt-get update && \
	apt-get install -y vim

COPY src /opt/app/

ENTRYPOINT ["node", "/opt/app/musician.js"]