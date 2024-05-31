# FROM nginx:1.23
FROM registry.cn-beijing.aliyuncs.com/autoxing/frontend-template:latest

WORKDIR /usr/share/nginx/html

RUN rm -rf *
COPY dist/static ./static
COPY dist/index.html .
