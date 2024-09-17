<template>
    <el-dialog v-model="centerDialogVisible" title="修改参数" width="500" :modal="false" center>
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
        <template #footer>
            <div class="dialog-footer">
                <el-button
                    @click="
                        cesiumHeatmap.remove();
                        centerDialogVisible = false;
                    "
                >
                    取消加载热力图
                </el-button>
                <el-button
                    type="primary"
                    @click="
                        reloadHeatMap();
                        centerDialogVisible = false;
                    "
                >
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>

    <el-button plain @click="centerDialogVisible = true" id="HeatBtn">人口热力图设置</el-button>
    <el-dropdown @command="handleCommand">
        <el-button size="large" type="primary">
            功能列表
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item command="fly">进行城市漫游</el-dropdown-item>
                <el-dropdown-item
                    command="loadMask"
                    v-text="MASK.MaskVisible.value ? '取消加载边界' : '显示城市边界'"
                ></el-dropdown-item>
                <el-dropdown-item
                    command="loadStreet"
                    v-text="STREET.RoadVisible.value ? '取消加载路网' : '加载动态路网'"
                ></el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <router-link to="/city_Day">
        <el-button id="btn" size="large" type="danger" text>日间模式</el-button>
    </router-link>
    <!-- <button @click=" city_fly_iterator.next">飞</button>
  <button @click="MASK.MaskVisible ? MASK.remove() : MASK.load()">json</button>
  <button @click="STREET.RoadVisible ? STREET.remove() : STREET.load()">Street</button> -->
    <div id="viewerDiv"></div>
</template>

<script setup lang="ts">
import {onMounted, getCurrentInstance, ref, reactive} from 'vue';
import * as Cesium from 'cesium';
import {createBaseViewer} from '@utils/map_view/createBaseViewer';
import {ElMessage} from 'element-plus';
import {CesiumHeatmap} from 'cesium-heatmap-es6';
import {Geoserver_WFS} from '@utils/map_view/Geoserver';
import {addStreet} from '@utils/map_view/StreetMaterial';
import {ArrowDown} from '@element-plus/icons-vue';
import '@/assets/layout/css/app.css';

let viewer: Cesium.Viewer;
// const popupVisible = ref(false);
let globe = getCurrentInstance()?.appContext.config.globalProperties; // 传出viewer的实例对象-给兄弟组件的
const centerDialogVisible = ref(false);
const handleCommand = (command: string) => {
    if (command == 'fly') {
        city_fly_iterator.next();
    } else if (command == 'loadMask') {
        MASK.MaskVisible.value ? MASK.remove() : MASK.load();
    } else if (command == 'loadStreet') {
        STREET.RoadVisible.value ? STREET.remove() : STREET.load();
    }
};

// 创建viewer
function createViewer(): void {
    viewer = createBaseViewer(viewer, 'viewerDiv', ['img', 'c']);
    //加载OSM底图
    let OSM = viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
            url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
        })
    );
    // OSM.hue = 3;//*图层色调
    OSM.contrast = -0.8; //*图层对比度
    var bloom = viewer.scene.postProcessStages.bloom;
    bloom.enabled = true;
    bloom.uniforms.glowOnly = false;
    bloom.uniforms.contrast = 160;
    bloom.uniforms.brightness = -0.4;
    bloom.uniforms.delta = 1.0;
    bloom.uniforms.sigma = 3.78;
    bloom.uniforms.stepSize = 5.0;
    viewer.scene.postProcessStages.fxaa.enabled = true;
    if (globe) globe.viewer = viewer;
}

async function loadTiles(): Promise<void> {
    await Cesium.Cesium3DTileset.fromIonAssetId(75343).then(tileset => {
        viewer.scene.primitives.add(tileset);
        tileset.style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    ['${Height} >= 300', "color(' #ffcf2f')"],
                    ['${Height} >= 200', "color(' #ac8cb4')"],
                    ['${Height} >= 100', "color('  #ffa74f')"],
                    ['${Height} >= 50', "color('  #ff925e')"],
                    ['${Height} >= 25', "color(' #5f7cdb')"],
                    ['${Height} >= 10', "color(' #62599d')"],
                    ['${Height} >= 5', "color(' #6ca2ab')"],
                    ['true', "color('  #ef7aab')"]
                ]
            }
        });
        viewer.zoomTo(tileset);
        var customShader = new Cesium.CustomShader({
            lightingModel: Cesium.LightingModel.PBR,
            fragmentShaderText: `
                    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
                        float _baseHeight = 0.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
                        float _heightRange = 60.0; // 高亮的范围(_baseHeight ~ _baseHeight + _      heightRange) 默认是 0-60米
                        float _glowRange = 300.0; // 光环的移动范围(高度)
                        float vtxf_height = fsInput.attributes.positionMC.z-_baseHeight;
                        float vtxf_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
                        float vtxf_a12 = vtxf_height / _heightRange + sin(vtxf_a11) * 0.1;
                         material.diffuse*= vec3(vtxf_a12, vtxf_a12, vtxf_a12);
                        float vtxf_a13 = fract(czm_frameNumber / 360.0);
                        float vtxf_h = clamp(vtxf_height / _glowRange, 0.0, 1.0);
                        vtxf_a13 = abs(vtxf_a13 - 0.5) * 2.0;
                        float vtxf_diff = step(0.005, abs(vtxf_h - vtxf_a13));
                        material.diffuse += material.diffuse * (1.0 - vtxf_diff);
                    }       
                    `
        });
        tileset.customShader = customShader;
    });
}

//城市飞行漫游(固定点转圈)
function fly(distance: number, angle: number, position: number[], times: number): void {
    // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值
    let pitch = Cesium.Math.toRadians(-45);
    // 给定飞行一周所需时间，每秒转动度数
    let angle_move = angle / times;
    // 给定相机距离点多少距离飞行
    let startTime = Cesium.JulianDate.fromDate(new Date());

    let stopTime = Cesium.JulianDate.addSeconds(startTime, times, new Cesium.JulianDate());
    viewer.clock.startTime = startTime.clone(); // 开始时间
    viewer.clock.stopTime = stopTime.clone(); // 结速时间
    viewer.clock.currentTime = startTime.clone(); // 当前时间
    viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
    // 相机的当前heading
    let initialHeading = viewer.camera.heading;
    let timeExecution = function TimeExecution() {
        // 当前已经过去的时间，单位s
        let delTime = Cesium.JulianDate.secondsDifference(
            viewer.clock.currentTime,
            viewer.clock.startTime
        );
        let heading = Cesium.Math.toRadians(delTime * angle_move) + initialHeading;
        viewer.scene.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(position[0], position[1], distance),
            // position, // 点的坐标
            orientation: {
                heading: heading,
                pitch: pitch
            }
        });
        viewer.scene.camera.moveBackward(distance);
        if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
            viewer.clock.onTick.removeEventListener(timeExecution);
        }
    };
    viewer.clock.onTick.addEventListener(timeExecution);
    setTimeout(() => {
        city_fly_iterator.next();
    }, 10050);
}

function* city_fly() {
    ElMessage({message: '城市漫游开始--点位1', type: 'info'});
    yield fly(1000, 360, [-73.966, 40.782], 10);
    ElMessage({message: '城市漫游开始--点位2', type: 'info'});
    yield fly(1000, 360, [-73.918, 40.714], 10);
    ElMessage({message: '城市漫游开始--点位3', type: 'info'});
    yield fly(1000, 360, [-73.946, 40.807], 10);
    ElMessage({message: '城市漫游开始--点位4', type: 'info'});
    yield fly(1000, 360, [-73.918, 40.714], 10);
    ElMessage({message: '城市漫游完成', type: 'success'});
    yield fly(1000, 360, [-74.0, 40.68462848], 10);
}
let city_fly_iterator = city_fly();

const MASK = {
    MaskVisible: ref(false),
    mask: new Cesium.Entity(),
    lineEntity: new Cesium.Entity(),
    //反选NewYork遮罩功能
    load: async function loadMask() {
        const positionArray: number[] = [];
        await Geoserver_WFS('NewYork', 'NewYork_border').then(res => {
            console.log(res);
            positionArray.push(...res.data.features[0].geometry.coordinates.flat(Infinity));
        });
        console.log(positionArray);
        //添加遮罩效果
        this.mask = new Cesium.Entity({
            polygon: {
                hierarchy: {
                    //添加外部遮盖区域
                    positions: Cesium.Cartesian3.fromDegreesArray([
                        -75, 40, -73, 40, -73, 42, -75, 42, -75, 40
                    ]),
                    //中心挖空的“洞”
                    holes: [
                        {
                            positions: Cesium.Cartesian3.fromDegreesArray(positionArray), //NewYork边界线
                            holes: []
                        }
                    ]
                },
                material: new Cesium.ColorMaterialProperty(
                    new Cesium.Color(15 / 255.0, 38 / 255.0, 84 / 255.0, 0.7)
                )
            }
        });
        if (this.mask) viewer.entities.add(this.mask);
        // 边界线
        this.lineEntity = new Cesium.Entity({
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray(positionArray),
                width: 5,
                material: new Cesium.Color(1.0, 1.0, 0, 1.0),
                // //@ts-ignore
                // new Spriteline1MaterialProperty(1000, '/public/PolyLine_material/Line_Blue.jpg'),
                clampToGround: true // 设置 clampToGround 为 true，实现贴地
            }
        });
        if (this.lineEntity) viewer.entities.add(this.lineEntity);

        //Entity动态材质测试
        // viewer.entities.add({
        //   polyline: {
        //     positions: Cesium.Cartesian3.fromDegreesArray([
        //       -73.966, 40.782,
        //       -73.918, 40.714,
        //     ]),
        //     // 宽度
        //     width: 5,
        //     // 线的颜色
        //     material:  //@ts-ignore
        //       new PolyLineMaterialProperty(1000, '/public/PolyLine_material/Snipaste3.png'),
        //   }
        // })

        this.MaskVisible.value = !this.MaskVisible.value;
    },

    remove: function removeMask() {
        if (this.mask) viewer.entities.remove(this.mask);
        if (this.lineEntity) viewer.entities.remove(this.lineEntity);
        this.MaskVisible.value = !this.MaskVisible.value;
    }
};
//加载NewYork路网信息
const STREET = {
    RoadVisible: ref(false),
    StreetPolyLine: new Cesium.Primitive(),
    load: async function loadStreet() {
        await Geoserver_WFS('NewYork', 'NewYork_Road').then(res => {
            console.log(res);
            let features = [];
            if (res.data.features && res.data.features.length > 0) {
                features = res.data.features;
                (this.StreetPolyLine as any) = addStreet(
                    viewer,
                    features,
                    '/PolyLine_material/Snipaste7.png'
                );
            }
        });
        this.RoadVisible.value = !this.RoadVisible.value;
    },
    remove: function removeStreet() {
        if (this.StreetPolyLine) viewer.scene.primitives.remove(this.StreetPolyLine);
        this.RoadVisible.value = !this.RoadVisible.value;
    }
};

//加载热力图
let cesiumHeatmap: CesiumHeatmap;
const Heat_opacity = ref(0.6);
const Heat_radius = ref(10);
const Heat_blur = ref(0.85);
let PopulationList: Array<any> = [];

async function getHeatData() {
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
}

function reloadHeatMap() {
    if (PopulationList.length > 2) {
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
}

function updateHeat_opacity() {
    cesiumHeatmap.updateHeatmap({opacity: Heat_opacity.value});
}

function updateHeat_blur() {
    cesiumHeatmap.updateHeatmap({blur: Heat_blur.value});
}

onMounted(() => {
    createViewer();
    loadTiles();
    getHeatData();
});
</script>

<style scoped>
#viewerDiv {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.el-dropdown {
    position: absolute;
    right: 20px;
    top: 70px;
    z-index: 3;
}

#btn {
    position: absolute;
    right: 150px;
    top: 70px;
    z-index: 3;
}

#HeatBtn {
    position: absolute;
    left: 40px;
    top: 70px;
    z-index: 3;
}
</style>
