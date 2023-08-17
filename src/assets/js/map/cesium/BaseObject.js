/*
 * @$START: =================
 * @Author: WQF
 * @Date: 2022-11-23 21:44:12
 * @company:
 * @LastEditors: WQF
 * @LastEditTime: 2022-11-23 22:03:13
 * @Description:
 * @$END: ===================
 */

export default class {
  constructor(viewer) {
    this.setViewer(viewer);
  }

  setViewer(viewer) {
    this.viewer = viewer;
    this.scene = viewer.scene;
    this.camera = viewer.camera;
    this.screenSpaceCameraController = viewer.scene.screenSpaceCameraController;
  }
}
