# example

> robot sdk example

## Edit config.js

``` bash
# path
./static/js/config.js

# config: mode
0: 国内（domestic） 1: 海外（overseas） -1: 测试（test）

# config: globalServicePath、globalWsPath
eg1:
mode: 0
globalServicePath、globalWsPath is ""

eg2:
mode: 1 
globalServicePath -> https://apiglobal.autoxing.com/
globalWsPath -> wss://serviceglobal.autoxing.com/
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
