/*
 * @$START: =================
 * @Author: WQF
 * @Date: 2023-01-11 15:38:55
 * @company: 
 * @LastEditors: WQF
 * @LastEditTime: 2023-01-11 15:39:49
 * @Description: 
 * @$END: ===================
 */
/**
 * @Author: Caven
 * @Date: 2020-05-11 23:28:13
 */

import * as Cesium from "cesium";
import { PathEventType } from '../EventType'
import Event from '../Event'

class PathEvent extends Event {
  constructor() {
    super()
  }

  /**
   *
   * @private
   */
  _registerEvent() {
    Object.keys(PathEventType).forEach(key => {
      let type = PathEventType[key]
      this._cache[type] = new Cesium.Event()
    })
  }
}

export default PathEvent
