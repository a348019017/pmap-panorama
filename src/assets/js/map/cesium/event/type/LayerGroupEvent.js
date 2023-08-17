/*
 * @$START: =================
 * @Author: WQF
 * @Date: 2023-01-11 15:38:55
 * @company: 
 * @LastEditors: WQF
 * @LastEditTime: 2023-01-11 15:39:30
 * @Description: 
 * @$END: ===================
 */
/**
 * @Author: Caven
 * @Date: 2020-08-28 20:18:04
 */

import * as Cesium from "cesium";
import { LayerGroupEventType } from '../EventType'
import Event from '../Event'

class LayerGroupEvent extends Event {
  constructor() {
    super()
  }

  /**
   * Register event for layer group
   * @private
   */
  _registerEvent() {
    Object.keys(LayerGroupEventType).forEach(key => {
      let type = LayerGroupEventType[key]
      this._cache[type] = new Cesium.Event()
    })
  }
}

export default LayerGroupEvent
