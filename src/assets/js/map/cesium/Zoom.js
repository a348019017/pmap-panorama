// const scratchZoomViewOptions = {
//     orientation: Cesium.HeadingPitchRoll(0,0,0),
//   };
import * as Cesium from "cesium";
import BaseObject from "./BaseObject.js";
let Cartesian3 = Cesium.Cartesian3;
let Cartesian2 = Cesium.Cartesian2;
let SceneMode = Cesium.SceneMode;
let defaultValue = Cesium.defaultValue;
const scratchSurfaceNormal = new Cesium.Cartesian3();
const scratchZoomPickRay = new Cesium.Ray();
const scratchPickCartesian = new Cesium.Cartesian3();
const scratchZoomOffset = new Cesium.Cartesian2();
const scratchZoomDirection = new Cesium.Cartesian3();
const scratchCenterPixel = new Cesium.Cartesian2();
const scratchCenterPosition = new Cesium.Cartesian3();
const scratchPositionNormal = new Cesium.Cartesian3();
const scratchPickNormal = new Cesium.Cartesian3();
const scratchZoomAxis = new Cesium.Cartesian3();
const scratchCameraPositionNormal = new Cesium.Cartesian3();

// Scratch variables used in zooming algorithm
const scratchTargetNormal = new Cesium.Cartesian3();
const scratchCameraPosition = new Cesium.Cartesian3();
const scratchCameraUpNormal = new Cesium.Cartesian3();
const scratchCameraRightNormal = new Cesium.Cartesian3();
const scratchForwardNormal = new Cesium.Cartesian3();
const scratchPositionToTarget = new Cesium.Cartesian3();
const scratchPositionToTargetNormal = new Cesium.Cartesian3();
const scratchPan = new Cesium.Cartesian3();
const scratchCenterMovement = new Cesium.Cartesian3();
const scratchCenter = new Cesium.Cartesian3();
const scratchCartesian = new Cesium.Cartesian3();
const scratchCartesianTwo = new Cesium.Cartesian3();
const scratchCartesianThree = new Cesium.Cartesian3();
const scratchDistanceCartographic = new Cesium.Cartographic();

export default class extends BaseObject {
  constructor(viewer) {
    super(viewer);
  }
  /**
   * @Author: WQF
   * @param {*} cameraDistance 缩放距离
   * @return {*}
   * @Description:
   */
  zoomMap(cameraDistance) {
    let position = this.camera.position;
    let startPosition = Cesium.Cartesian2.fromCartesian3(position);
    //修改相机缩进速度，正数放大，负数缩小
    //滚轮缩放值-32.72492347489368
    let movement = {
      startPosition: new Cesium.Cartesian2(0, 0),
      //修改相机缩进速度，正数放大，负数缩小
      //滚轮缩放值-32.72492347489368
      endPosition: new Cesium.Cartesian2(0, cameraDistance),
    };
    if (this.scene.mode === SceneMode.SCENE3D) {
      this.mapZoom3D(
        this.scene.screenSpaceCameraController,
        startPosition,
        movement
      );
    } else {
      this.mapZoom2D(
        this.scene.screenSpaceCameraController,
        startPosition,
        movement
      );
    }
  }
  mapZoom2D(controller, startPosition, movement) {
    // if (defined(movement.distance)) {
    //   movement = movement.distance;
    // }

    const scene = controller._scene;
    const camera = scene.camera;

    this.handleZoom(
      controller,
      startPosition,
      movement,
      controller._zoomFactor,
      camera.getMagnitude()
    );
  }

  mapZoom3D(controller, startPosition, movement) {
    // if (defined(movement.distance)) {
    //   movement = movement.distance;
    // }
  
    const ellipsoid = controller._ellipsoid;
    const scene = controller._scene;
    const camera = scene.camera;
    const canvas = scene.canvas;
  
    const cameraUnderground = controller._cameraUnderground;
    const zoomCVWindowPos = new Cesium.Cartesian2();
    const zoomCVWindowRay = new Cesium.Ray();
    let windowPosition;
  
    if (cameraUnderground) {
      windowPosition = startPosition;
    } else {
      windowPosition = zoomCVWindowPos;
      windowPosition.x = canvas.clientWidth / 2;
      windowPosition.y = canvas.clientHeight / 2;
    }
  
    const ray = camera.getPickRay(windowPosition, zoomCVWindowRay);
    const zoom3DCartographic = new Cesium.Cartographic();
  
    let intersection;
    const zoomCVIntersection = new Cesium.Cartesian3();
    const height = ellipsoid.cartesianToCartographic(
      camera.position,
      zoom3DCartographic
    ).height;
    if (height < controller._minimumPickingTerrainHeight) {
      intersection = this.pickGlobe(controller, windowPosition, zoomCVIntersection);
    }
  
    let distance;
    // let defined = new Cesium.defined()
    if (Cesium.defined(intersection)) {
      distance = Cartesian3.distance(ray.origin, intersection);
    }
  
    if (cameraUnderground) {
      const distanceUnderground = this.getZoomDistanceUnderground(
        controller,
        ray,
        height
      );
      if (Cesium.defined(distance)) {
        distance = Math.min(distance, distanceUnderground);
      } else {
        distance = distanceUnderground;
      }
      // distance = 0
      // camera.zoomIn(distance);
      // return;
    }
  
    if (!Cesium.defined(distance)) {
      distance = height;
    }
    const zoom3DUnitPosition = new Cesium.Cartesian3();
    const unitPosition = Cartesian3.normalize(
      camera.position,
      zoom3DUnitPosition
    );
    this.handleZoom(
      controller,
      startPosition,
      movement,
      controller._zoomFactor,
      distance,
      Cartesian3.dot(unitPosition, camera.direction)
    );
  }

  handleZoom(
    object,
    startPosition,
    movement,
    zoomFactor,
    distanceMeasure,
    unitPositionDotDirection
  ) {
    let percentage = 1.0;
    if (Cesium.defined(unitPositionDotDirection)) {
      percentage = Cesium.Math.clamp(
        Math.abs(unitPositionDotDirection),
        0.25,
        1.0
      );
    }
  
    const diff = movement.endPosition.y - movement.startPosition.y;
    // distanceMeasure should be the height above the ellipsoid.
    // When approaching the surface, the zoomRate slows and stops minimumZoomDistance above it.
    const approachingSurface = diff > 0;
    const minHeight = approachingSurface
      ? object.minimumZoomDistance * percentage
      : 0;
    const maxHeight = object.maximumZoomDistance;
  
    const minDistance = distanceMeasure - minHeight;
    let zoomRate = zoomFactor * minDistance;
    zoomRate = Cesium.Math.clamp(
      zoomRate,
      object._minimumZoomRate,
      object._maximumZoomRate
    );
  
    let rangeWindowRatio = diff / object._scene.canvas.clientHeight;
    rangeWindowRatio = Math.min(rangeWindowRatio, object.maximumMovementRatio);
    let distance = zoomRate * rangeWindowRatio;
  
    if (
      object.enableCollisionDetection ||
      object.minimumZoomDistance === 0.0 ||
      !Cesium.defined(object._globe) // look-at mode
    ) {
      //Math.abs(distanceMeasure - minHeight)控制缩放最后一级
      //源码 < 1  ScreenSpaceCameraController
      if (distance > 0.0 && Math.abs(distanceMeasure - minHeight) < 2.0) {
        return;
      }
  
      if (distance < 0.0 && Math.abs(distanceMeasure - maxHeight) < 2.0) {
        return;
      }
      // if( distanceMeasure==0 ){
      //   return;
      // }
  
      if (distanceMeasure - distance < minHeight) {
        distance = distanceMeasure - minHeight - 1.0;
      } else if (distanceMeasure - distance > maxHeight) {
        distance = distanceMeasure - maxHeight;
      }
    }
  
    const scene = object._scene;
    const camera = scene.camera;
    const mode = scene.mode;
    const scratchZoomViewOptions = {
      orientation: new Cesium.HeadingPitchRoll(0, 0, 0),
    };
    const orientation = scratchZoomViewOptions.orientation;
    orientation.heading = camera.heading;
    orientation.pitch = camera.pitch;
    orientation.roll = camera.roll;
  
    if (camera.frustum instanceof Cesium.OrthographicFrustum) {
      if (Math.abs(distance) > 0.0) {
        camera.zoomIn(distance);
        camera._adjustOrthographicFrustum();
      }
      return;
    }
  
    const sameStartPosition = new Cesium.Cartesian2.equals(
      startPosition,
      object._zoomMouseStart
    );
    let zoomingOnVector = object._zoomingOnVector;
    let rotatingZoom = object._rotatingZoom;
    let pickedPosition;
  
    if (!sameStartPosition) {
      object._zoomMouseStart = new Cesium.Cartesian2.clone(
        startPosition,
        object._zoomMouseStart
      );
  
      if (Cesium.defined(object._globe)) {
        if (mode === SceneMode.SCENE2D) {
          pickedPosition = camera.getPickRay(
            startPosition,
            scratchZoomPickRay
          ).origin;
          pickedPosition = Cartesian3.fromElements(
            pickedPosition.y,
            pickedPosition.z,
            pickedPosition.x
          );
        } else {
          pickedPosition = this.pickGlobe(object, startPosition, scratchPickCartesian);
        }
      }
      if (Cesium.defined(pickedPosition)) {
        object._useZoomWorldPosition = true;
        object._zoomWorldPosition = Cartesian3.clone(
          pickedPosition,
          object._zoomWorldPosition
        );
      } else {
        object._useZoomWorldPosition = false;
      }
  
      zoomingOnVector = object._zoomingOnVector = false;
      rotatingZoom = object._rotatingZoom = false;
      object._zoomingUnderground = object._cameraUnderground;
    }
  
    if (!object._useZoomWorldPosition) {
      camera.zoomIn(distance);
      return;
    }
  
    let zoomOnVector = mode === SceneMode.COLUMBUS_VIEW;
  
    if (camera.positionCartographic.height < 2000000) {
      rotatingZoom = true;
    }
  
    if (!sameStartPosition || rotatingZoom) {
      if (mode === SceneMode.SCENE2D) {
        const worldPosition = object._zoomWorldPosition;
        const endPosition = camera.position;
  
        if (
          !Cartesian3.equals(worldPosition, endPosition) &&
          camera.positionCartographic.height < object._maxCoord.x * 2.0
        ) {
          const savedX = camera.position.x;
  
          const direction = Cartesian3.subtract(
            worldPosition,
            endPosition,
            scratchZoomDirection
          );
          Cartesian3.normalize(direction, direction);
  
          const d =
            (Cartesian3.distance(worldPosition, endPosition) * distance) /
            (camera.getMagnitude() * 0.5);
          camera.move(direction, d * 0.5);
  
          if (
            (camera.position.x < 0.0 && savedX > 0.0) ||
            (camera.position.x > 0.0 && savedX < 0.0)
          ) {
            pickedPosition = camera.getPickRay(
              startPosition,
              scratchZoomPickRay
            ).origin;
            pickedPosition = Cartesian3.fromElements(
              pickedPosition.y,
              pickedPosition.z,
              pickedPosition.x
            );
            object._zoomWorldPosition = Cartesian3.clone(
              pickedPosition,
              object._zoomWorldPosition
            );
          }
        }
      } else if (mode === SceneMode.SCENE3D) {
        const cameraPositionNormal = Cartesian3.normalize(
          camera.position,
          scratchCameraPositionNormal
        );
        if (
          object._cameraUnderground ||
          object._zoomingUnderground ||
          (camera.positionCartographic.height < 3000.0 &&
            Math.abs(Cartesian3.dot(camera.direction, cameraPositionNormal)) <
              0.6)
        ) {
          zoomOnVector = true;
        } else {
          const canvas = scene.canvas;
  
          const centerPixel = scratchCenterPixel;
          centerPixel.x = canvas.clientWidth / 2;
          centerPixel.y = canvas.clientHeight / 2;
          const centerPosition = this.pickGlobe(
            object,
            centerPixel,
            scratchCenterPosition
          );
          // If centerPosition is not defined, it means the globe does not cover the center position of screen
  
          if (!Cesium.defined(centerPosition)) {
            zoomOnVector = true;
          } else if (camera.positionCartographic.height < 1000000) {
            // The math in the else block assumes the camera
            // points toward the earth surface, so we check it here.
            // Theoretically, we should check for 90 degree, but it doesn't behave well when parallel
            // to the earth surface
            if (Cartesian3.dot(camera.direction, cameraPositionNormal) >= -0.5) {
              zoomOnVector = true;
            } else {
              const cameraPosition = scratchCameraPosition;
              Cartesian3.clone(camera.position, cameraPosition);
              const target = object._zoomWorldPosition;
  
              let targetNormal = scratchTargetNormal;
  
              targetNormal = Cartesian3.normalize(target, targetNormal);
  
              if (Cartesian3.dot(targetNormal, cameraPositionNormal) < 0.0) {
                return;
              }
  
              const center = scratchCenter;
              const forward = scratchForwardNormal;
              Cartesian3.clone(camera.direction, forward);
              Cartesian3.add(
                cameraPosition,
                Cartesian3.multiplyByScalar(forward, 1000, scratchCartesian),
                center
              );
  
              const positionToTarget = scratchPositionToTarget;
              const positionToTargetNormal = scratchPositionToTargetNormal;
              Cartesian3.subtract(target, cameraPosition, positionToTarget);
  
              Cartesian3.normalize(positionToTarget, positionToTargetNormal);
  
              const alphaDot = Cartesian3.dot(
                cameraPositionNormal,
                positionToTargetNormal
              );
              if (alphaDot >= 0.0) {
                // We zoomed past the target, and this zoom is not valid anymore.
                // This line causes the next zoom movement to pick a new starting point.
                object._zoomMouseStart.x = -1;
                return;
              }
              const alpha = Math.acos(-alphaDot);
              const cameraDistance = Cartesian3.magnitude(cameraPosition);
              const targetDistance = Cartesian3.magnitude(target);
              const remainingDistance = cameraDistance - distance;
              const positionToTargetDistance =
                Cartesian3.magnitude(positionToTarget);
  
              const gamma = Math.asin(
                Cesium.Math.clamp(
                  (positionToTargetDistance / targetDistance) * Math.sin(alpha),
                  -1.0,
                  1.0
                )
              );
              const delta = Math.asin(
                Cesium.Math.clamp(
                  (remainingDistance / targetDistance) * Math.sin(alpha),
                  -1.0,
                  1.0
                )
              );
              const beta = gamma - delta + alpha;
  
              const up = scratchCameraUpNormal;
              Cartesian3.normalize(cameraPosition, up);
              let right = scratchCameraRightNormal;
              right = Cartesian3.cross(positionToTargetNormal, up, right);
              right = Cartesian3.normalize(right, right);
  
              Cartesian3.normalize(
                Cartesian3.cross(up, right, scratchCartesian),
                forward
              );
  
              // Calculate new position to move to
              Cartesian3.multiplyByScalar(
                Cartesian3.normalize(center, scratchCartesian),
                Cartesian3.magnitude(center) - distance,
                center
              );
              Cartesian3.normalize(cameraPosition, cameraPosition);
              Cartesian3.multiplyByScalar(
                cameraPosition,
                remainingDistance,
                cameraPosition
              );
  
              // Pan
              const pMid = scratchPan;
              Cartesian3.multiplyByScalar(
                Cartesian3.add(
                  Cartesian3.multiplyByScalar(
                    up,
                    Math.cos(beta) - 1,
                    scratchCartesianTwo
                  ),
                  Cartesian3.multiplyByScalar(
                    forward,
                    Math.sin(beta),
                    scratchCartesianThree
                  ),
                  scratchCartesian
                ),
                remainingDistance,
                pMid
              );
              Cartesian3.add(cameraPosition, pMid, cameraPosition);
  
              Cartesian3.normalize(center, up);
              Cartesian3.normalize(
                Cartesian3.cross(up, right, scratchCartesian),
                forward
              );
  
              const cMid = scratchCenterMovement;
              Cartesian3.multiplyByScalar(
                Cartesian3.add(
                  Cartesian3.multiplyByScalar(
                    up,
                    Math.cos(beta) - 1,
                    scratchCartesianTwo
                  ),
                  Cartesian3.multiplyByScalar(
                    forward,
                    Math.sin(beta),
                    scratchCartesianThree
                  ),
                  scratchCartesian
                ),
                Cartesian3.magnitude(center),
                cMid
              );
              Cartesian3.add(center, cMid, center);
  
              // Update camera
  
              // Set new position
              Cartesian3.clone(cameraPosition, camera.position);
  
              // Set new direction
              Cartesian3.normalize(
                Cartesian3.subtract(center, cameraPosition, scratchCartesian),
                camera.direction
              );
              Cartesian3.clone(camera.direction, camera.direction);
  
              // Set new right & up vectors
              Cartesian3.cross(camera.direction, camera.up, camera.right);
              Cartesian3.cross(camera.right, camera.direction, camera.up);
  
              camera.setView(scratchZoomViewOptions);
              return;
            }
          } else {
            const positionNormal = Cartesian3.normalize(
              centerPosition,
              scratchPositionNormal
            );
            const pickedNormal = Cartesian3.normalize(
              object._zoomWorldPosition,
              scratchPickNormal
            );
            const dotProduct = Cartesian3.dot(pickedNormal, positionNormal);
  
            if (dotProduct > 0.0 && dotProduct < 1.0) {
              const angle = Cesium.Math.acosClamped(dotProduct);
              const axis = Cartesian3.cross(
                pickedNormal,
                positionNormal,
                scratchZoomAxis
              );
  
              const denom =
                Math.abs(angle) > Cesium.Math.toRadians(20.0)
                  ? camera.positionCartographic.height * 0.75
                  : camera.positionCartographic.height - distance;
              const scalar = distance / denom;
              camera.rotate(axis, angle * scalar);
            }
          }
        }
      }
  
      object._rotatingZoom = !zoomOnVector;
    }
  
    if ((!sameStartPosition && zoomOnVector) || zoomingOnVector) {
      let ray;
      const zoomMouseStart = new Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        scene,
        object._zoomWorldPosition,
        scratchZoomOffset
      );
      if (
        mode !== SceneMode.COLUMBUS_VIEW &&
        Cartesian2.equals(startPosition, object._zoomMouseStart) &&
        Cesium.defined(zoomMouseStart)
      ) {
        ray = camera.getPickRay(zoomMouseStart, scratchZoomPickRay);
      } else {
        ray = camera.getPickRay(startPosition, scratchZoomPickRay);
      }
  
      const rayDirection = ray.direction;
      if (mode === SceneMode.COLUMBUS_VIEW || mode === SceneMode.SCENE2D) {
        Cartesian3.fromElements(
          rayDirection.y,
          rayDirection.z,
          rayDirection.x,
          rayDirection
        );
      }
  
      camera.move(rayDirection, distance);
  
      object._zoomingOnVector = true;
    } else {
      camera.zoomIn(distance);
    }
  
    if (!object._cameraUnderground) {
      camera.setView(scratchZoomViewOptions);
    }
  }
  pickGlobe(controller, mousePosition, result) {
    const scene = controller._scene;
    const globe = controller._globe;
    const camera = scene.camera;
  
    if (!Cesium.defined(globe)) {
      return undefined;
    }
  
    const cullBackFaces = !controller._cameraUnderground;
    const scratchDepthIntersection = new Cesium.Cartesian3();
    const scratchRayIntersection = new Cesium.Cartesian3();
    let depthIntersection;
    if (scene.pickPositionSupported) {
      depthIntersection = scene.pickPositionWorldCoordinates(
        mousePosition,
        scratchDepthIntersection
      );
    }
    const pickGlobeScratchRay = new Cesium.Ray();
    const ray = camera.getPickRay(mousePosition, pickGlobeScratchRay);
    const rayIntersection = globe.pickWorldCoordinates(
      ray,
      scene,
      cullBackFaces,
      scratchRayIntersection
    );
  
    const pickDistance = Cesium.defined(depthIntersection)
      ? Cartesian3.distance(depthIntersection, camera.positionWC)
      : Number.POSITIVE_INFINITY;
    const rayDistance = Cesium.defined(rayIntersection)
      ? Cartesian3.distance(rayIntersection, camera.positionWC)
      : Number.POSITIVE_INFINITY;
  
    if (pickDistance < rayDistance) {
      return Cartesian3.clone(depthIntersection, result);
    }
  
    return Cartesian3.clone(rayIntersection, result);
  }
  getZoomDistanceUnderground(controller, ray) {
    const origin = ray.origin;
    const direction = ray.direction;
    const distanceFromSurface = this.getDistanceFromSurface(controller);
  
    // Weight zoom distance based on how strongly the pick ray is pointing inward.
    // Geocentric normal is accurate enough for these purposes
    const surfaceNormal = Cartesian3.normalize(origin, scratchSurfaceNormal);
    let strength = Math.abs(Cartesian3.dot(surfaceNormal, direction));
    strength = Math.max(strength, 0.5) * 2.0;
    return distanceFromSurface * strength;
  }
  getDistanceFromSurface(controller) {
    const ellipsoid = controller._ellipsoid;
    const scene = controller._scene;
    const camera = scene.camera;
    const mode = scene.mode;
  
    let height = 0.0;
    if (mode === SceneMode.SCENE3D) {
      const cartographic = ellipsoid.cartesianToCartographic(
        camera.position,
        scratchDistanceCartographic
      );
      if (Cesium.defined(cartographic)) {
        height = cartographic.height;
      }
    } else {
      height = camera.position.z;
    }
    const globeHeight = defaultValue(controller._scene.globeHeight, 0.0);
    const distanceFromSurface = Math.abs(globeHeight - height);
    return distanceFromSurface;
  }
}



