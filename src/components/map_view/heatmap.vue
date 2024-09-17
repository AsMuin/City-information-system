<template>
    <div class="slider-demo-block">
        <span class="demonstration">透明度</span>
        <el-slider
            v-model="Heat_opacity"
            :min="0.1"
            :max="1"
            :step="0.01"
            @input="updateHeat_opacity()"
        />
    </div>
    <div class="slider-demo-block">
        <span class="demonstration">变化程度</span>
        <el-slider
            v-model="Heat_blur"
            :min="0.1"
            :max="1"
            :step="0.01"
            @input="updateHeat_blur()"
        />
    </div>
    <div class="slider-demo-block">
        <span class="demonstration">半径</span>
        <el-slider
            v-model="Heat_radius"
            :min="1"
            :max="100"
            :step="1"
            @input="cesiumHeatmap.updateRadius(Heat_radius)"
        />
    </div>
</template>

<script setup lang="ts">
import * as Cesium from 'cesium';
import {onMounted, getCurrentInstance, ref} from 'vue';
import {CesiumHeatmap, HeatmapPoint} from 'cesium-heatmap-es6';
import {Geoserver_WFS} from '@utils/map_view/Geoserver';
import {createBaseViewer} from '@utils/map_view/createBaseViewer';
let viewer: Cesium.Viewer;

let cesiumHeatmap: CesiumHeatmap;
const Heat_opacity = ref(0.6);
const Heat_radius = ref(10);
const Heat_blur = ref(0.85);
let PopulationList: Array<any> = [];

async function Heat() {
    await Geoserver_WFS('NewYork', 'NewYork_Popu').then(res => {
        // 遍历GeoJSON数据的features数组
        res.data.features.forEach((point: any) => {
            // 获取当前feature的坐标和人口数
            // 格式化数据，并将其添加到formattedData数组中
            PopulationList.push({
                x: point.geometry.coordinates[0],
                y: point.geometry.coordinates[1],
                value: point.properties.Popu
            });
        });
    });
    console.log(PopulationList);
    cesiumHeatmap = new CesiumHeatmap(viewer, {
        noLisenerCamera: false,
        renderType: 'primitive',
        zoomToLayer: false,
        points: PopulationList,
        heatmapDataOptions: {max: 100, min: 0},
        heatmapOptions: {
            radius: 10,
            opacity: 0.5,
            maxOpacity: 1,
            minOpacity: 0
        }
    });
}

function updateHeat_opacity() {
    cesiumHeatmap.updateHeatmap({opacity: Heat_opacity.value});
}

function updateHeat_blur() {
    cesiumHeatmap.updateHeatmap({blur: Heat_blur.value});
}
onMounted(() => {
    viewer = getCurrentInstance()?.appContext.config.globalProperties.viewer; //接收Mounted周期兄弟主组件才创建好并传出的viewer
    Heat();
});
</script>

<style scoped></style>
