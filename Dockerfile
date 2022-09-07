FROM nginx:1.23

WORKDIR /usr/share/nginx/html

RUN rm -rf *
COPY dist/static ./static
COPY dist/index.html .
