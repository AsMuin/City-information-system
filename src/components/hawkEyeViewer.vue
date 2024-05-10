<template>
  <div id="EyeViewer"></div>
</template>

<script setup lang="ts">
import { onMounted, getCurrentInstance } from "vue";
import * as Cesium from "cesium";
// import { getTdT } from "../utils/tdt_layer";
import { createBaseViewer } from "../utils/createBaseViewer";

let MainViewer: Cesium.Viewer;
let EyeViewer: Cesium.Viewer;

function createEyeViewer() {
  EyeViewer = new Cesium.Viewer("EyeViewer", {
    infoBox: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    baseLayer:
      new Cesium.ImageryLayer(
        new Cesium.OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/'
        })
      ),
  });
  (EyeViewer.cesiumWidget.creditContainer as HTMLDivElement).style.display = //隐藏数据来源
    "none"; //viewer.cesiumWidget.creditContainer声明HTMLdiv容器避免TS编译器报错

  EyeViewer.scene.skyBox.show = false; //隐藏天空盒
  EyeViewer.scene.backgroundColor = Cesium.Color.TRANSPARENT; //隐藏背景
  EyeViewer.scene.sun.show = false; //隐藏太阳
  EyeViewer.scene.moon.show = false; //隐藏月亮
  // EyeViewer = createBaseViewer(EyeViewer, "EyeViewer", ["vec", "w"]);

  EyeViewer.scene.screenSpaceCameraController.enableRotate = false; //禁止鼠标控制旋转
  EyeViewer.scene.screenSpaceCameraController.enableZoom = false; //禁止鼠标控制缩放
  EyeViewer.scene.screenSpaceCameraController.enableTilt = false; //禁止鼠标控制视角
}

function moveEvent(MainViewer: Cesium.Viewer) {
  // 监听MainViewer的camera的变化
  MainViewer.camera.changed.addEventListener(() => {
    // 调用EyeViewer的camera的flyTo方法，将MainViewer的camera位置和朝向应用到EyeViewer中
    EyeViewer.camera.flyTo({
      // 目标位置为MainViewer的camera的位置
      destination: MainViewer.camera.position,
      // 朝向为MainViewer的camera的heading、pitch和roll
      orientation: {
        heading: MainViewer.camera.heading,
        pitch: MainViewer.camera.pitch,
        roll: MainViewer.camera.roll,
      },
      // 持续时间设置为0.4s
      duration: 0.2,
    });
  });
}

onMounted(() => {
  MainViewer = getCurrentInstance()?.appContext.config.globalProperties.viewer; //接收Mounted周期兄弟主组件才创建好并传出的viewer
  createEyeViewer();
  moveEvent(MainViewer);
});
</script>

<style scoped>
#EyeViewer {
  position: absolute;
  width: 400px;
  height: 300px;
  bottom: 0;
  right: 0;
  z-index: 999;
  border: 1px solid rgb(28, 28, 31);
  border-radius: 20%;
  overflow: hidden;
}
</style>
