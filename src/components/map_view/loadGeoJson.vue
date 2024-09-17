<template>
    <div id="viewerDiv"></div>
</template>

<script setup lang="ts">
import * as CesiumHeat from 'cesium-heatmap';
import {onMounted, ref, getCurrentInstance} from 'vue';
import * as Cesium from 'cesium';
import {createBaseViewer} from '@utils/map_view/createBaseViewer';
import {ElMessage} from 'element-plus';

// 初始化地球

let viewer: Cesium.Viewer;
const information = ref('');
let adcodeNow: number;
let adcodeHistory: number[] = [];
function createViewer() {
    viewer = createBaseViewer(viewer, 'viewerDiv', ['vec', 'w']);
    if (globe) globe.viewer = viewer; // 导出viewer
}
let globe = getCurrentInstance()?.appContext.config.globalProperties;
// 加载GeoJson
async function loadGeoJson(adcode: number) {
    // 从指定的URL加载GeoJson数据，参数为adcode
    await Cesium.GeoJsonDataSource.load(
        `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`,
        {
            stroke: Cesium.Color.RED
        }
    ).then((dataSource: Cesium.GeoJsonDataSource) => {
        // 将加载的GeoJson数据添加到viewer中
        viewer.dataSources.add(dataSource);
        // 获取dataSource中的entities
        let entities = dataSource.entities.values;
        // 遍历entities中的每一个entity
        entities.forEach(entity => {
            // 获取entity的颜色(随机生成颜色，并设置entity的material)
            let color: Cesium.Color = Cesium.Color.fromRandom({alpha: 0.2}); //透明度调整为0.2
            // if (entity.polygon) {
            //   entity.label = new Cesium.LabelGraphics({
            //     text: "test",
            //     font: "20px sans-serif",
            //     style: Cesium.LabelStyle.FILL,
            //     // 对齐方式(水平和竖直)
            //     horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            //     verticalOrigin: Cesium.VerticalOrigin.CENTER,
            //     pixelOffset: new Cesium.Cartesian2(20, -2),
            //     showBackground: true,
            //     backgroundColor:  Cesium.Color.fromBytes(0, 70, 24),
            //   });
            //   console.log(entity);
            // }
            // 设置entity的material
            if (entity.polygon) {
                entity.polygon.material = new Cesium.ColorMaterialProperty(color);

                (entity.polygon.outline as unknown) = false;
                (entity.polygon.extrudedHeight as unknown) = 20000; //高度扩大20000倍，便于观察!
            }
        });
    });

    //移动视角
    viewer.flyTo(viewer.dataSources.get(viewer.dataSources.length - 1));
    console.log(viewer.dataSources.get(viewer.dataSources.length - 1));

    adcodeNow = adcode; //更新adcodeNow
}
// 监听鼠标点击事件(左键双击)
function pickEntity() {
    viewer.screenSpaceEventHandler.setInputAction((click: any) => {
        // 获取点击位置的entity实体
        let entity = viewer.scene.pick(click.position);
        if (entity) {
            information.value = entity.id.properties;
            console.log(entity.id.properties._adcode._value);
            ElMessage(`adcode:${entity.id.properties.adcode}  name:${entity.id.properties.name}`);
            //删除旧区域
            viewer.dataSources.removeAll();
            // 加载新的区域
            adcodeHistory.push(adcodeNow); //将当前adcode加入历史记录
            loadGeoJson(entity.id.properties.adcode); //加载新的区域（adcodeNow也更新了）
        } else if (adcodeHistory.length > 0) {
            viewer.dataSources.removeAll();
            loadGeoJson(adcodeHistory[adcodeHistory.length - 1]);
            adcodeHistory.pop();
            ElMessage('返回上一级区域');
        }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}

onMounted(() => {
    createViewer();
    loadGeoJson(100000);
    pickEntity();
});
</script>

<style scoped>
#viewerDiv {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>
