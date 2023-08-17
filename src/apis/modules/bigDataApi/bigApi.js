/*
 * @$START: =================
 * @Author: WQF
 * @Date: 2022-12-08 14:32:42
 * @company:
 * @LastEditors: WQF
 * @LastEditTime: 2022-12-08 16:44:10
 * @Description:大数据接口代理
 * @$END: ===================
 */
import http from "@/apis/http";
// const BASE_URL = window.SYS_CONFIG.base_url
/* ============================wqf-  ============================== */
// * @Description: 代理内网接口：http://10.21.166.133:9001/hnlydsj/vis
// * @Description: 代理外网接口：http://lydsj.lyj.hunan.gov.cn:8081/hnlydsj/vis
const Base_url_1 = window.SYS_CONFIG.bigDataAPI;

export const bigApi_1 = {
  GET: (url, params) => {
    return http({
      method: "GET",
      url: `${Base_url_1}/${url}`,
      // url: `/hnlydsj/vis/${url}`,
      // headers: {
      //     'x-api': 'server.core.dataCatalog.CatalogController.queryDatasetAndDataIndexToCatalog'
      // }
      params,
    });
  },

  POST: (url, params) => {
    return http({
      method: "POST",
      url: `${Base_url_1}/${url}`,
      // url: `/hnlydsj/vis/${url}`,
      data: params,
    });
  },
};

export default {
  Base_url_1,
};
