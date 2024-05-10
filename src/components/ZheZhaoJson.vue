<template>
  <div id="viewerDiv"></div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted } from "vue";
import * as Cesium from "cesium";
import { createBaseViewer } from "../utils/createBaseViewer";

let viewer: Cesium.Viewer;
function createViewer() {
  viewer = createBaseViewer(viewer, "viewerDiv", ["img", "w"]);
}

//获取json数据中的点位数据
async function loadJson() {
  let positionArray: number[] = [];
  await axios
    .get("https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=100000")
    .then((res) => {
      let coordinates = res.data.features[0].geometry.coordinates[0];
      coordinates[0].forEach((position: any) => {
        positionArray.push(position[0], position[1]);
      });
    });
  //注意Cesium不支持成对的数组进行坐标转换，如[114,30]这个数组无法直接使用，需要转换为(114,30)的格式
  //如果是利用数组批量转换则是[114,30   ,120,45    ,120,30]  不支持[[114,30],[120,45],[120,30]]
  console.log(Cesium.Cartesian3.fromDegrees(114, 30));

  //添加遮罩效果
  let mask = new Cesium.Entity({
    polygon: {
      hierarchy: {
        //添加外部区域为1/4半圆，设置为180会报错
        positions: Cesium.Cartesian3.fromDegreesArray([
          0, 0, 0, 90, 179, 90, 179, 0,
        ]),
        //中心挖空的“洞”
        holes: [
          {
            positions: Cesium.Cartesian3.fromDegreesArray(positionArray),
            holes: [],
          },
        ],
      },
      material: new Cesium.ColorMaterialProperty(
        Cesium.Color.GRAY.withAlpha(0.3)
      ),
    },
  });
  viewer.entities.add(mask);
}

onMounted(() => {
  createViewer();
  loadJson();
});
</script>

<style scoped></style>
