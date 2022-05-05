# protobuf-vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### 格式化proto下方文件夹里面所有proto下方; Ex src/proto/adlab/demo.proto;
```
pbjs -t json src/proto/*/*.proto > src/proto/proto.json
```