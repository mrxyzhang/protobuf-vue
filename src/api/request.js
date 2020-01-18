import axios from 'axios'
import protoRoot from '@/protoGenerate/proto'
import protobuf from 'protobufjs'

const httpService = axios.create({
  timeout: 45000,
  method: 'post',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/octet-stream',
  },
  responseType: 'arraybuffer',
})

// 請求
const PBMessageRequest = protoRoot.lookup('framework.PBMessageRequest')
// 回應
const PBMessageResponse = protoRoot.lookup('framework.PBMessageResponse')

const apiVersion = '1.0.0'
const token = 'my_token'

// 所有 API 接口
function getMessageTypeValue(msgType) {
  const PBMessageType = protoRoot.lookup('framework.PBMessageType')
  const ret = PBMessageType.values[msgType]
  return ret
}

// 將請求數據 encode 成二進制，encode 是 proto.js 提供的方法
function transformRequest(data) {
  console.log('data', PBMessageRequest.encode(data).finish())
  return PBMessageRequest.encode(data).finish()
}

function isArrayBuffer(obj) {
  return Object.prototype.toString.call(obj) === '[object ArrayBuffer]'
}

function transformResponseFactory(responseType) {
  return function transformResponse(rawResponse) {
    // 判斷 response 是否是 arrayBuffer
    if (rawResponse == null || !isArrayBuffer(rawResponse)) {
      return rawResponse
    }
    try {
      const buf = protobuf.util.newBuffer(rawResponse)
      // decode 回應
      const decodedResponse = PBMessageResponse.decode(buf)
      if (decodedResponse.messageData && responseType) {
        const model = protoRoot.lookup(responseType)
        decodedResponse.messageData = model.decode(decodedResponse.messageData)
      }
      console.log('decodedResponse', decodedResponse)
      return decodedResponse
    } catch (err) {
      return err
    }
  }
}

/**
 * @param {*} msgType API 接口名稱 (getStudentList)
 * @param {*} requestBody 請求參數
 * @param {*} responseType 返回值
 */
function request(msgType, requestBody, responseType) {
  const _msgType = getMessageTypeValue(msgType)

  const reqData = {
    timeStamp: new Date().getTime(),
    type: _msgType,
    version: apiVersion,
    messageData: requestBody,
    token: token,
  }

  // 將物件轉換成請求實例
  const req = PBMessageRequest.create(reqData)

  /*
    使用 axios 發起請求
    這裡用到axios的配置項：transformRequest和transformResponse 
    transformRequest 發起請求時，調用transformRequest方法，目的是將req轉換成二進制 
    transformResponse 對返回的數據進行處理，目的是將二進制轉換成真正的json數據
  */
  return httpService
    .post('/api', req, {
      transformRequest,
      transformResponse: transformResponseFactory(responseType),
    })
    .then(
      ({ data, status }) => {
        // 对请求做处理
        if (status !== 200) {
          const err = new Error('服务器异常')
          throw err
        }
        console.log(data)
      },
      err => {
        throw err
      }
    )
}

// 在 request 下添加一個方法，方便用於處理請求參數
request.create = function(protoName, obj) {
  const pbConstruct = protoRoot.lookup(protoName)
  return pbConstruct.encode(obj).finish()
}

export default request
