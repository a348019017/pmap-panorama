/*
 * @$START: =================
 * @Author: WQF
 * @Date: 2023-01-11 15:38:55
 * @company: 
 * @LastEditors: WQF
 * @LastEditTime: 2023-01-11 15:40:21
 * @Description: 
 * @$END: ===================
 */
/**
 * @Author: Caven
 * @Date: 2021-06-08 20:37:28
 */
import * as Cesium from "cesium";
import { TrackEventType } from '../EventType'
import Event from '../Event'

class TrackEvent extends Event {
  constructor() {
    super()
  }

  /**
   *
   * @private
   */
  _registerEvent() {
    Object.keys(TrackEventType).forEach(key => {
      let type = TrackEventType[key]
      this._cache[type] = new Cesium.Event()
    })
  }
}

export default TrackEvent
