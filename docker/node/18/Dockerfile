FROM ubuntu:22.04

RUN apt-get update && \
	apt-get upgrade --yes && \
	apt-get install --yes \
	curl \
	make \
	gcc \
	g++ \
	libvips-dev && \
	curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
	apt-get install --yes nodejs
