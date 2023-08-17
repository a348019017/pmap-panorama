import http from "../http";
const BASE_URL = 'https://lydsj.lyj.hunan.gov.cn:8280';
// const BASE_URL_Decision = window.SYS_CONFIG.base_url;

// 获取湖南行政区域
export const getCityHunan = () => {
  return http({
    method: "GET",
    url: `${BASE_URL}/decision/tc-district/queryCityHunan`,
  });
};

export const getGeoJson = (url) => {
  return http({
    method: "GET",
    url: url,
  });
}
// 获取湖南行政区域通过用户所属区域
export const queryCityHunans = (params) => {
  return http({
    method: "GET",
    url: `${BASE_URL}/decision/tc-district/queryCityHunans`,
    params
    // headers: {
    //     'x-api': 'server.core.dataCatalog.CatalogController.queryDatasetAndDataIndexToCatalog'
    // }
  });
};
// 获取行政区划的geom
export const getDistrictInfo = (params) => {
  return http({
    method: "GET",
    // url: `${BASE_URL}/decision/tc-district/queryDistrictInfoOrWithChild`,
    url: `${BASE_URL}/decision/tc-district/queryDistrictInfoOrWithChildsBysg`,
    params,
  });
};

// 4根据开始时间、时长和类型获取天气预报服务气象图，用于叠加到图层
export const getWeatherPics = (params) => {
  return http({
    method: "POST",
    url: "https://fires.piesat.cn/pc/weather/getWeatherPics",
    // url:`${BASE_URL}/pc/weather/getWeatherPics`,
    params,
  });
  // params: {
  //   beginTime: "2021102510",
  //   hours: 6,
  //   type: "rain",
  // }
  // return:
  // {
  //   "status": 200,
  //   "code": 200,
  //   "data": [
  //     {
  //       "forecastTime": "2021080319",
  //       "dataSourcePath": "/datasource/ECMWF_C1D_SURF/2021080300/C1D_SURF_2021080300_2021080311.nc",
  //       "picRelativePath": "/Weather/temp/temp20210803T11011Z.png"
  //     }
  //   ]
  // }
};
// 5根据期次和站点ID获取天气实况信息
export const getSiteWeatherValue = (params) => {

  return http({
    method: "GET",
    // url: "https://fires.piesat.cn/pc/weather/getWeatherInfoDetails",
    url: "https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/sad/decision/slfh/getWeatherInfoDetails",
    // url:`${BASE_URL}/pc/weather/getWeatherInfoDetails`,
    params,
  });
  // params: {
  //   issue: "2021102510",
  //   stationId: 57554,
  // }
  // return:
  // {
  //   "status": 200,
  //   "code": 200,
  //   "data": {
  //     "data": {
  //       "PRE": "999998",   降水
  //       "WIN_D_Avg_10mi": "70", 风向
  //       "WIN_S_Avg_10mi": "2",  风速
  //       "PRE_1h": "0",  1小时降水
  //       "TEM": "18.4" 温度
  //     },
  //     "issue": "2021080319" 期次
  //   }
  // }
};
// 8 根据经纬度，返回当前位置现在，以及未来1,2,3,6,12小时天气情况
export const getLonLatWeatherValue = (params) => {

  return http({
    method: "GET",
    url: "https://fires.piesat.cn/pc/weather/pickupWeatherValue",
    // url:`${BASE_URL}/pc/weather/pickupWeatherValue`,
    params,
  });
  // params: {
  //   beginTime: "2021102510",
  //   hour:6
  //   lon: 113.5,
  //   lat: 23.5,
  // }
  // return:
  // {
  //   "status": 200,
  //   "code": 200,
  //   "data": {
  //     "2022110810": {
  //       "rain": 0.0,   降雨
  //       "vis": 17813.574,  能见度
  //       "windD": 53.534092, 风向
  //       "temp": 19.519043, 温度
  //       "windS": 1.0897113, 风速
  //       "rhu": 0.5860938 湿度
  //     },
  //     "2022110809": {
  //       "rain": 0.0,
  //       "vis": 17088.852,
  //       "windD": 67.6818,
  //       "temp": 17.127167,
  //       "windS": 1.1056302,
  //       "rhu": 0.6757765
  //     },
  //     "2022110808": {
  //       "rain": 0.0,
  //       "vis": 16364.128,
  //       "windD": 80.671875,
  //       "temp": 14.735291,
  //       "windS": 1.1849246,
  //       "rhu": 0.7813614
  //     }
  //   },
  //   "limitTime": 0
  // }
};
// 4.25 查询实况数据
export const getMeteorologicalData = (params) => {
  return http({
    method: "POST",
    url: `${BASE_URL_Decision}/decision/nc/read/getMeteorologicalData`,
    data: params
  });
};
// 4.24 查询预报数据
export const findPredictionData = (params) => {
  return http({
    method: "POST",
    url: `${BASE_URL_Decision}/decision/weatherdata/findPredictionData`,
    data: params
  });
};
// 森林火险等级(不用)
// export const getForestFire = (params) => {
//   return http({
//     method: "GET",
//     url: "https://fires.piesat.cn/pc/weather/getForestFire",
//     params,
//   });
// };
// 森林火险等级
export const getForestFire = (params) => {
  return http({
    method: "GET",
    url: `${BASE_URL_Decision}/decision/slfh/hxdj`,
    params,
  });
};

// 火灾档案
export const getForestFireda = (params) => {
  return http({
    method: "GET",
    url: `${BASE_URL_Decision}/decision/slfh/hzda`,
    params,
  });
};
// 火灾档案详情
export const hzdaDetail = (params) => {
  return http({
    method: "POST",
    url: `${BASE_URL_Decision}/decision/slfh/hzdaDetail`,
    data: params
  });
};
// 火灾档案详情填报
export const saveHzda = (params) => {
  return http({
    method: "POST",
    url: `${BASE_URL_Decision}/decision/slfh/saveHzda`,
    data: params,
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // headers: { 'content-type': 'application/form-data' },
  });
};
// 火情信息
export const getForestFirexx = (params) => {
  return http({
    method: "GET",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/getAllFirePoint`,
    params
  });
};

// 灾后评估查询详情
export const getZHPGInfo = (params) => {
  return http({
    method: "GET",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/zhpg/info`,
    params
  });
};
// 灾后评估属性填报
export const saveZhpg = (params) => {
  return http({
    method: "Post",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/zhpg/saveZhpg`,
    data: params
  });
};
// 灾后评估图片上传
export const zhpgUploadImg = (params) => {
  // return http({
  //   method: "POST",
  //   // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
  //   url: `${BASE_URL_Decision}/decision/slfh/zhpg/uploadImg`,
  //   data:params
  // });

  let dataParam = new FormData();
  dataParam.append("hzbh", params.hzbh);
  for (var i = 0; i < params.xcImgList.length; i++) {
    let item = params.xcImgList[i];
    dataParam.append("xcImgList", item.raw, item.raw.name);
  }
  for (var i = 0; i < params.zhImgList.length; i++) {
    let item = params.zhImgList[i];
    dataParam.append("zhImgList", item.raw, item.raw.name);
  }

  var resp = http({
    method: "POST",
    headers: { "content-type": "multipart/form-data" },
    url: `${BASE_URL_Decision}/decision/slfh/zhpg/uploadImg?`,
    data: dataParam
  });
  return resp;
};
// 灾后评估图片下载
export const zhpgDownload = (params) => {
  return http({
    method: "GET",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/zhpg/download`,
    params
  });
};
// 灾后评估图片删除
export const zhpgDeleteImg = (params) => {
  return http({
    method: "GET",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/zhpg/deleteImg`,
    params
  });
};
// 灾后评估报告导出
export const zhpgExport = (params) => {
  return http({
    method: "GET",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/zhpg/export`,
    params
  });
};
// 收藏-查询火点收藏
export const queryFirePoint = (params) => {
  return http({
    method: "GET",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/collection/queryFirePoint`,
    params
  });
};
// 收藏-添加火点收藏
export const collectFirePoint = (params) => {
  return http({
    method: "POST",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/collection/collectFirePoint`,
    data: params
  });
};
// 收藏-取消火点收藏
export const cancelFirePoint = (params) => {
  return http({
    method: "GET",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/collection/cancelFirePoint`,
    params
  });
};
// 收藏-删除火点收藏
export const deleteFirePoint = (params) => {
  return http({
    method: "POST",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/collection/deleteFirePoint`,
    data: params
  });
};
// 收藏-添加火场收藏
export const collectFireField = (params) => {
  return http({
    method: "POST",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/collection/collectFireField`,
    data: params
  });
};
// 收藏-取消火场收藏
export const cancelFireField = (params) => {
  return http({
    method: "GET",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/collection/cancelFireField`,
    params
  });
};
// 收藏-删除火场收藏
export const deleteFireField = (params) => {
  return http({
    method: "POST",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/collection/deleteFireField`,
    data: params
  });
};
// 收藏-查询火场收藏
export const queryFireField = (params) => {
  return http({
    method: "GET",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/collection/queryFireField`,
    params
  });
};

// 火场信息
export const getForestFireGroundxx = (params) => {
  return http({
    method: "GET",
    // url: `${BASE_URL_Decision}/decision/slfh/hqxx`,
    url: `${BASE_URL_Decision}/decision/slfh/fireField`,
    params,
  });
};

// 根据地名查询经纬度信息
export const getLonAndLatInfo = (params) => {
  return http({
    method: "GET",
    url: `${BASE_URL}/decision/tc-district/getPosition`,
    params,
  });
};


// 1 poi查询，返回坐标 
export const getLonAndLatByPOI = (params) => {
  //针对高德接口
  // params = {...params,citylimit:true, key:'24efd48a3b0bf6862d833daa7a4fd7a4'}
  //let url = 'https://restapi.amap.com/v3/place/text?'

  // 针对百度接口
  params = { ...params, city_limit: true, ret_coordtype: 'gcj02ll', output: 'json', ak: 'nEDyGgDbGhTQfl2kzjdeEIZ1qe1uLVwL' }
  //因为跨域，使用代理后地址
  // let url = '/baidu/place/v2/search?' 
  let url = `${BASE_URL}/place/v2/search?`;
  return http({
    method: "GET",
    url: url,
    params,
  });
};

// 2 poi查询智能提示信息
export const getPoiTipList = (params) => {
  //针对高德接口
  //params = {...params,citylimit:true, key:'24efd48a3b0bf6862d833daa7a4fd7a4'}
  //let url = 'https://restapi.amap.com/v3/assistant/inputtips?'

  params = { ...params, city_limit: true, ret_coordtype: 'gcj02ll', output: 'json', ak: 'nEDyGgDbGhTQfl2kzjdeEIZ1qe1uLVwL' }
  let url = `${BASE_URL}/place/v2/search?`;
  // let url = '/baidu/place/v2/search?' //'https://api.map.baidu.com/place/v2/suggestion?'不好用，所以暂时search接口替代
  return http({
    method: "GET",
    url: url,
    params,
  });
};


// 3 逆地名地址服务  通过坐标返回 地名信息,参数 比如 params={location:'31.225696563611,121.49884033194'} ； wgs84坐标下的经纬度
export const reverseGeocoding = (params) => {
  // 百度接口
  params = { ...params, city_limit: true, coordtype: 'wgs84ll', output: 'json', ak: 'nEDyGgDbGhTQfl2kzjdeEIZ1qe1uLVwL', ret_coordtype: "gcj02ll" }
  let url = `${BASE_URL}/reverse_geocoding/v3/?`
  return http({
    method: "GET",
    url: url,
    params,
  });
};

// 4 获取天气接口，参数传区划code 比如 params={district_id:430100}
export const getWeatherbyAreaCode = (params) => {
  //百度接口

  params = { ...params, data_type: 'all', ak: 'DpFrsju11VRuUnlxcCqilBK0XsHqOj86' }
  let url = `${BASE_URL}/weather/v1/?`
  // let url = '/baidu/weather/v1/?'
  return http({
    method: "GET",
    url: url,
    params,
  });
};


// 5 路径规划
export const getPathDriver = (params) => {
  //百度接口
  // params = {
  //   origin:'27.72208155184426,112.21238541297454',destination:'25.72208155184426,112.21238541297454'
  // }
  params = { ...params, coord_type: 'wgs84', ret_coordtype: 'gcj02', ak: 'nEDyGgDbGhTQfl2kzjdeEIZ1qe1uLVwL' }
  let url = `${BASE_URL}/directionlite/v1/driving?`
  // let url = '/baidu/directionlite/v1/driving?'
  return http({
    method: "GET",
    url: url,
    params,
  });
};

// 缓冲区查询
export const getDataByBuffer = (params) => {
  return http({
    method: "GET",
    url: 'https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapserverx/湖南省消防专业队伍调查数据/资源一张图_2021_地类/query?',
    params,
  });
};

export const query = (serverName, layerName, options) => {
  options = options || {
    filter, spatialFilter, limit
  }

  var resp = http.post(`https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapserverx/${serverName}/${layerName}/query`, options)
  return resp.data
}

export const queryLzz = (data) => {
  //
  //使用方法
  var now = new Date();
  var startTime = now.formatCode('YYYY-MM-DDT00:00:00');
  var frontOneHour = new Date(now.getTime() - 10 * 60 * 1000);
  startTime = frontOneHour.formatCode('YYYY-MM-DDTHH:mm:ss')

  var endTime = now.formatCode('YYYY-MM-DDTHH:mm:ss');
  let distCode = '';
  if (data) {
    distCode = data.distCode;
  }
  var params = {
    // "distCode":156430100
    "distCode": distCode,
    'startTime': startTime,
    'endTime': endTime
  };
  if(data.startTime&&data.endTime){
    params.startTime = data.startTime;
    params.endTime = data.endTime;
  }
  var resp = http({
    method: "GET",
    url: 'https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/sad/decision/slfh/getPatrolOfficerNew?',//getPatrolOfficer  getPatrolOfficerNew
    params
  });
  return resp;
}


//巡护人员 区划统计接口
export const patrolOfficerCountByCode = () => {
  //使用方法
  debugger
  var now = new Date();
  var startTime = now.formatCode('YYYY-MM-DDT00:00:00');
  var frontOneHour = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  startTime = frontOneHour.formatCode('YYYY-MM-DDTHH:mm:ss')

  var endTime = now.formatCode('YYYY-MM-DDTHH:mm:ss');
  var params = {
    'startTime': startTime,
    'endTime': endTime
  };
  var resp = http({
    method: "GET",
    url: 'https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/sad/decision/slfh/getPatrolOfficerCountByCode?',
    params
  });
  return resp;
}

export const queryPersonInfo = (params) => {
  //
  //使用方法
  var resp = http({
    method: "GET",
    url: 'https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/sad/decision/slfh/getPatrolOfficerInfo?',
    params
  });
  return resp;
}
// 一长四员信息查询
export const queryHLYInfo =(params)=>  {
  var resp = http({
    method: "POST",
    url: '/lyForest/organization/getforestrangerinfo?',
    params
  });
  return resp;
}

// 风向图
export const queryWindAngleSpeed = (params) => {
  //
  //使用方法
  var resp = http({
    method: "GET",
    url: 'https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/sad/decision/nc/read/queryWindAngleSpeed',
    params
  });
  return resp;
}

export const queryFireSpread = (params) => {
  var resp = http({
    method: "GET",
    url: 'http://fires.piesat.cn/pc/fireSpread/getFireSpreadNewInfo?',
    params
  });
  return resp;
}

export const queryXMLLegend = () => {
  var resp = http({
    method: "GET",
    // url:'/data/product.config.xml',
    url: 'https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/sad/data/product.config.xml',
    ContentType: 'application/xml',
    Accept: "*/*"
  });
  return resp;
}

export const anlaysisFireSpreadAnalysis = (params) => {
  var resp = http({
    method: "GET",
    // url:'/data/product.config.xml',
    url: `${BASE_URL_Decision}/decision/slfh/analysisSpread?`,
    params
  });
  return resp;
}

export const queryFireSpreadAnalysis = (params) => {
  var resp = http({
    method: "GET",
    // url:'/data/product.config.xml',
    url: `${BASE_URL_Decision}/decision/slfh/fireSpread?`,
    params
  });
  return resp;
}


export const uploadHzdaImgs = (params) => {
  let dataParam = new FormData();
  dataParam.append("hdId", params.hdId);
  for (var i = 0; i < params.hcsytList.length; i++) {
    let item = params.hcsytList[i];
    dataParam.append("hcsytList", item.raw, item.raw.name);
  }
  for (var i = 0; i < params.hcxczpList.length; i++) {
    let item = params.hcxczpList[i];
    dataParam.append("hcxczpList", item.raw, item.raw.name);
  }

  var resp = http({
    method: "POST",
    headers: { "content-type": "multipart/form-data" },
    url: `${BASE_URL_Decision}/decision/slfh/uploadHzdaImgs?`,
    data: dataParam
  });
  return resp;
}

export const queryLinzhong = (params) => {
  var resp = http({
    method: "POST",
    url: `https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/tsc/mapserverx/资源一张图_2021_地类/2021森林资源一张图/query?`,
    data: params
  });
  return resp;
}

export const querytDictionary = (params) => {
  var resp = http({
    method: "POST",
    url: `https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/dms/hndbm/dictionaryInfo/getDictionaryInfo`,
    data: params
  });
  return resp;
}

//获取图片的Blob值
export const getImageBlob = (url) => {

  var resp = http({
    method: "GET",
    url: url,
    responseType: 'blob'
  });

  return resp;
}




//获取图片的Blob值
export const deleteImg = (params) => {

  var resp = http({
    method: "GET",
    url: `${BASE_URL_Decision}/decision/slfh/deleteImg`,
    params
  });
  return resp;
}

// 扑火指挥保存
export const addSlfhPhzh = (params) => {
  var resp = http({
    method: "POST",
    url: `${BASE_URL_Decision}/decision/slfh/addSlfhPhzh`,
    data: params,
    headers: { 'content-type': 'application/json' },
  });
  return resp;
}

// 扑火指挥修改
export const updateSlfhPhzh = (params) => {
  var resp = http({
    method: "POST",
    url: `${BASE_URL_Decision}/decision/slfh/updateSlfhPhzh`,
    data: params,
    headers: { 'content-type': 'application/json' },
  });
  return resp;
}

// 扑火指挥删除
export const deleteSlfhPhzh = (params) => {
  var resp = http({
    method: "GET",
    url: `${BASE_URL_Decision}/decision/slfh/deleteSlfhPhzh`,
    params,
  });
  return resp;
}
// 扑火指挥弹框查询信息
export const getSlfhzhData = (params) => {
  var resp = http({
    method: "GET",
    url: `${BASE_URL_Decision}/decision/slfh/getSlfhPhzhData`,
    params,
  });
  return resp;
}
// 扑火预案弹框查询信息
export const getSlfhynData = (params) => {
  var resp = http({
    method: "GET",
    url: `https://lydsj.lyj.hunan.gov.cn:8380/hnlydsj/sad/decision/slfh/listPhya`,
    params
  });
  return resp;
}
// 扑火指导、扑火措施、扑火难点弹框查询信息
export const getSlfhXxtsData = (params) => {
  var resp = http({
    method: "GET",
    url: `${BASE_URL_Decision}/decision/slfh/getSlfhXxtsData`,
    params
  });
  return resp;
}

// 扑火指导、扑火措施、扑火难点弹框信息保存
export const addSlfhZhpj = (params) => {
  var resp = http({
    method: "POST",
    url: `${BASE_URL_Decision}/decision/slfh/addSlfhZhpj`,
    data: params,
    headers: { 'content-type': 'application/json' },
  });
  return resp;
}

// 火场现状查询接口
export const getfireFightStatusSearch = (params) => {
  var resp = http({
    method: "POST",
    url: `${BASE_URL_Decision}/decision/slfh/hzdaDetail`,
    data: params,
    headers: { 'content-type': 'application/json' },
  });
  return resp;
}
// 扑火指导、扑火措施、扑火难点弹框信息保存
export const savefireFightStatusSearch = (params) => {
  var resp = http({
    method: "POST",
    url: `${BASE_URL_Decision}/decision/slfh/saveHzda`,
    data: params,
    headers: { 'content-type': 'application/json' },
  });
  return resp;
}

// 视频上墙列表
export const getVideoList = (params) => {
  var resp = http({
    method: "POST",
    url: `/hnLywl/ws/getCamera`,
    data: params,
    headers: { 'content-type': 'application/json' },
  });
  return resp;
}
// 视频上墙-获取播放地址
export const getPreviewURLs = (params) => {
  var resp = http({
    method: "POST",
    url: `/hnLywl/ws/previewURLs`,
    data: params,
    headers: { 'content-type': 'application/json' },
  });
  return resp;
}
// 视频上墙-播放
export const openPreviewURLs = (params) => {
  var resp = http({
    method: "GET",
    url: `/hnLywl/ws/video/preview_ep.html?url=${params.url}&indexCode=${params.indexcode}&title=${params.fullOrgName}&videoType=${params.videoType}&x=${params.longitude}&y=${params.latitude}`,
  });
  return resp;
}
// 火场现状图片保存
// export const savehcxzPic=(params) => {
//   var resp = http({
//     method: "POST",
//     url:`${BASE_URL_Decision}/decision/slfh/uploadHzdaImgs`,
//     data:params,
//     headers:{"content-type":"multipart/form-data"},
//    });
//    return resp;
// }
export const savehcxzPic = (params) => {
  let dataParam = new FormData();
  dataParam.append("hdId", params.hdId);
  for (var i = 0; i < params.hcsytList.length; i++) {
    let item = params.hcsytList[i];
    dataParam.append("hcsytList", item.raw, item.raw.name);
  }
  for (var i = 0; i < params.hcxczpList.length; i++) {
    let item = params.hcxczpList[i];
    dataParam.append("hcxczpList", item.raw, item.raw.name);
  }

  var resp = http({
    method: "POST",
    headers: { "content-type": "multipart/form-data" },
    url: `${BASE_URL_Decision}/decision/slfh/uploadHzdaImgs?`,
    data: dataParam
  });
  return resp;
}
// 火灾档案详情填报 /decision/slfh/phmx/addModel
export const addModel = (params) => {
  return http({
    method: "POST",
    url: `${BASE_URL_Decision}/decision/slfh/phmx/addModel`,
    data: params,
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // headers: { 'content-type': 'application/form-data' },
  });
};


Date.prototype.formatCode = function (formatStr = "yyyy-MM-DD HH:mm:ss") {
  const paddingZero = num => num >= 10 ? num : '0' + num;
  let str = formatStr;
  str = str.replace(/yyyy|YYYY/, this.getFullYear());
  str = str.replace(/MM/, paddingZero(this.getMonth() + 1));
  str = str.replace(/dd|DD/, paddingZero(this.getDate()));
  str = str.replace(/hh|HH/, paddingZero(this.getHours()));
  str = str.replace(/mm/, paddingZero(this.getMinutes()));
  str = str.replace(/ss/, paddingZero(this.getSeconds()));
  str = str.replace(/SS/, paddingZero(this.getMilliseconds()));
  return str;
};
