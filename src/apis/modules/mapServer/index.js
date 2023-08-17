/*
 * @$START: =================
 * @Author: WQF
 * @Date: 2022-11-23 21:24:11
 * @company:
 * @LastEditors: WQF
 * @LastEditTime: 2023-01-11 17:17:05
 * @Description:
 * @$END: ===================
 */
import axios from "axios";
const http = axios.create({
  // baseURL: "/hnMapServer/mapserver/",
  baseURL: "",
  timeout: 1000 * 30,
});

export async function query(serverName, layerName, options) {
  options = options || {
    filter: "",
    spatialFilter: "",
    limit: "",
  };
  // const http1 = axios.create({
  //     baseURL: '/hnMapServer1/',
  //     timeout: 1000 * 30
  // })
  // return http.post(`${serverName}/${layerName}/query`, options)
  try{
  var resp = await http.post(`https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapserverx/${serverName}/${layerName}/query`, options);
  //var resp = await http1.post(`https://lydsj.lyj.hunan.gov.cn:8380/hnMapServer/mapserve/${serverName}/${layerName}/query`, options)
  return resp.data;
  }catch(e){
    return null;
  }
}

// 获取服务信息
export async function serverInfo(serverName) {
  // var res = await http.get(`serverInfo/${serverName}.json`)
  // https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/dms/shareApi/mapserver/serverInfo/2013年湖南二调小班.json
  let baseURL = `https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/dms/shareApi/mapserver/serverInfo/${serverName}.json`;
  var res = await http.get(baseURL);
  return res.data;
}
// 获取图层信息
export async function layerInfo(serverName, dataName) {
  // 示例：请求数据
  // https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapeditor/mapserver/vmap/WMTS/1.0/湖南省重要火源点调查数据/默认/getTile/{z}/{y}/{x}
  // serverName = 湖南省重要火源点调查数据
  // dataName = 默认
  // 完整请求地址为：https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapeditor/mapserver/styleInfo/湖南省重要火源点调查数据/默认/layer.json'
  // 返回数据
  // 获取到结果:  获取图层服务layerName=name=湖南省重要火源点调查数据
  // query数据查询为:https://lydsj.lyj.hunan.gov.cn:8380/hnMapServer/mapserver/湖南省重要火源点调查数据/湖南省重要火源点调查数据/query?

  // var res = await http.get(`styleInfo/${serverName}/${dataName}/layer.json`)
  var res = await http.get(`https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapeditor/mapserve/${serverName}/${dataName}/layer.json`);
  return res.data;
}

// 获取图层信息
export async function layerInfoName(serverName) {
  // 示例：请求数据
  // https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapeditor/mapserver/vmap/WMTS/1.0/湖南省重要火源点调查数据/默认/getTile/{z}/{y}/{x}
  // serverName = 湖南省重要火源点调查数据
  // dataName = 默认
  // 完整请求地址为：https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapeditor/mapserver/styleInfo/湖南省重要火源点调查数据/默认/layer.json'
  // 返回数据
  // 获取到结果:  获取图层服务layerName=name=湖南省重要火源点调查数据
  // query数据查询为:https://lydsj.lyj.hunan.gov.cn:8380/hnMapServer/mapserver/湖南省重要火源点调查数据/湖南省重要火源点调查数据/query?

  // var res = await http.get(`styleInfo/${serverName}/${dataName}/layer.json`)
  var res = await http.get(`https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/dms/shareApi/mapserver/serverInfo/${serverName}.json`);
  return res.data;
}

export async function layerInfo2(serverName, dataName) {
  var res = await http.get(`https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapeditor/mapserver/styleInfo/${serverName}/${dataName}/layer.json`);
  return res.data;
}

//属性查询-灾后评估（空间分析）
export async function getFields_sx(layerName, styleName) {
  var res = await http.get(`https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapserverx/${layerName}/${styleName}/fields`);
  return res.data;
}

//服务id查询-灾后评估（空间分析）
export async function getServer_id(layerName) {
  var res = await http.get(`https://lydsj.lyj.hunan.gov.cn:8380/hnMapServer/mapserver/serverInfo/${layerName}.json`);
  return res.data;
}

//获取图斑数据-灾后评估（空间分析）
export async function analysisQuery(params) {
  var res = await http.post(`https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/themap/getMapTree/analysis/mapServer/query`,params);
  // var res = await http.post(`/hnlydsj/themap/getMapTree/analysis/mapServer/query`,params);
  return res.data;
}

// 根据服务id获取查询字典表字段
export async function getDicClassByMapServerId(serverId) {
  var res = await http.get(`https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/themap/getMapTree/hndbm/dictionaryInfo/getDicClassByMapServerId?id=${serverId}`);
  //  var res = await http.get(`/hnlydsj/themap/getMapTree/hndbm/dictionaryInfo/getDicClassByMapServerId?id=${serverId}`);
  return res.data;
}

// 获取图斑数据
export async function pointPolymerize_back(params) {
  //修改代理
  var res = await http.post("https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapserverx/point_aggr_result/point_aggr_result/query", params);
  // https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapserverx/point_aggr_result/point_aggr_result/query
  return res.data;
}

// 获取字典表中文
export async function getCodeByType(params) {
  var res = await http.post(`https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/themap/getMapTree/hndbm/dictionaryInfo/getCodeByType`,params);
  // var res = await http.post("/hnlydsj/themap/getMapTree/hndbm/dictionaryInfo/getCodeByType", params);
  return res.data;
}

// const base_host = window.SYS_CONFIG.base_host;
// export async function pointPolymerize(params) {
//   let url = `https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapserverx/point_aggr_result/point_aggr_result/query`;
//   //   let url = `${base_host}/hnlydsj/tsc/mapserverx/point_aggr_result/point_aggr_result/query`;
//   var res = await http({
//     method: "POST",
//     //   url: `${BASE_URL}/decision/lyxm/getFundCondition`,
//     url: url,
//     data: params,
//   });
//   return res.data;
// }
