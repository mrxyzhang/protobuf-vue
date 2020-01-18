import request from './request'

export function getStudentList(params) {
  const req = request.create('PBStudentListReq', params)
  return request('getStudentList', req, 'school.PBStudentListRsp')
}

// 後面如果再添加接口直接以此類推
// export function getStudentById(id) {
//   // const req = ...
//   // return request(...)
// }
