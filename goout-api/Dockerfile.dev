FROM node:15

ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \  
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# /app 디렉토리 생성
RUN mkdir -p /app

# /app 디렉토리를 WORKDIR 로 설정
WORKDIR /app

# 현재 Dockerfile 있는 경로의 모든 파일을 /app 에 복사
ADD . /app

# npm install 을 실행
RUN npm install

# Entrypoint 지정
RUN chmod +x docker-entrypoint.sh  
ENTRYPOINT ./docker-entrypoint.sh

#가상 머신에 오픈할 포트
EXPOSE 3000