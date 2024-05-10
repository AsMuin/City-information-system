<template>
  <div id="popup">
    <el-card width:auto v-if="popupVisible">
      <p v-for="(item, index) in information" :key="index">
        <span id="pop-index">{{ index }}：</span><span>{{ item }}</span>
      </p>
      <img
        src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
        alt=""
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, getCurrentInstance, ref } from "vue";
import * as Cesium from "cesium";

let viewer: Cesium.Viewer;
const popupVisible = ref(false);
const information = ref();
const hightLighted = {
  entity: null,
  originalColor: new Cesium.Color(),
};
//气泡框显示
function showPopup(position: Cesium.Cartesian2) {
  const pop = document.getElementById("popup");
  if (pop) {
    pop.style.top = position.y + 10 + "px";
    pop.style.left = position.x + 10 + "px";
    pop.style.zIndex = '2';
    popupVisible.value = true;
  }
}
// 监听鼠标点击事件(左键显示popup，右键隐藏popup)

function pickEntity() {
  //定义屏幕点击事件
  viewer.screenSpaceEventHandler.setInputAction((click: any) => {
    //将点击位置的屏幕二维坐标转换为不包含地形的笛卡尔坐标
    let cartesian3 = viewer.scene.camera.pickEllipsoid(
      click.position,
      viewer.scene.globe.ellipsoid
    );
    if (cartesian3) {
      //将笛卡尔坐标转换为地理坐标并存储为realPosition
      realPosition = Cesium.Cartographic.fromCartesian(cartesian3);
    }
    // 获取点击位置的entity实体
    let entity = viewer.scene.pick(click.position);
    //判断是否拾取到entity
    if (entity) {
      // console.log(entity);
      // console.log(entity.getPropertyIds());
      let infoList: any = {};
      entity.getPropertyIds().forEach((key: string) => {
        let item = entity.getProperty(key);
        infoList[key] = item;
      });
      // console.log(infoList);
      //清除之前高亮的entity
      if (hightLighted.entity) {
        (hightLighted.entity as any).color = hightLighted.originalColor;
      }
      // 设置当前选中的entity为高亮，同时传入原始颜色
      hightLighted.entity = entity;
      hightLighted.originalColor = entity.color;
      //高亮当前选中的entity
      entity.color = Cesium.Color.RED;
      // console.log(entity.id.polygon.material);
      // 获取entity的属性信息
      information.value = infoList;
      // 设置entity的材质为红色
      // 显示popup弹窗
      showPopup(click.position);
    } else {
      if (hightLighted.entity) {
        (hightLighted.entity as any).color = hightLighted.originalColor;
      }
      // 隐藏popup
      popupVisible.value = false;
    }
    watchViewerMove(); //启动地图监听
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  viewer.screenSpaceEventHandler.setInputAction(() => {
    if (hightLighted.entity) {
      (hightLighted.entity as any).color = hightLighted.originalColor;
    }
    // 隐藏popup
    popupVisible.value = false;
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

// let windowPosition: Cesium.Cartesian2;
let realPosition: Cesium.Cartographic;
//监听地图移动
function watchViewerMove() {
  if (!popupVisible) return; //判断弹窗是否存在，若不存在就退出监听
  viewer.scene.preRender.addEventListener(() => {
    const pop = document.getElementById("popup");
    //根据地理坐标获取entity当前的屏幕坐标
    if (realPosition != null) {
      let cartesian3 = Cesium.Cartesian3.fromRadians(
        realPosition.longitude,
        realPosition.latitude,
        realPosition.height,
        viewer.scene.globe.ellipsoid
      );
      let windowPositionNow = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        viewer.scene,
        cartesian3
      );
      if (pop && windowPositionNow) {
        pop.style.top = windowPositionNow.y + 10 + "px";
        pop.style.left = windowPositionNow.x + 1 + "px";
      }
    }
  });
}
onMounted(() => {
  viewer = getCurrentInstance()?.appContext.config.globalProperties.viewer; //接收Mounted周期兄弟主组件才创建好并传出的viewer
  pickEntity();
});
</script>

<style scoped>
#popup {
  position: absolute;
  overflow: hidden;
}
#pop-index {
  font-style: italic;
  background-color: #dfdbdb6e;
  color: rgb(78, 150, 153);
}
</style>
