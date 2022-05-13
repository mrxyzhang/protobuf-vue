# protobuf-vue

## Project setup
```
npm install
```

## Project init
```
npm run protoJson
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### 格式化proto下方文件夹里面所有proto下方; Ex src/proto/adlab/demo.proto;
```
npx pbjs -t json src/proto/*/*.proto > src/proto/proto.json
```
