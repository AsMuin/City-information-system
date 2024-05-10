
import * as Cesium from 'cesium';
import { getTdT } from './tdt_layer';
export function createBaseViewer(viewerName: Cesium.Viewer, viewerDiv: string, baseLayer?: Array<string>) {
    viewerName = new Cesium.Viewer(viewerDiv, {
        selectionIndicator: false,
        infoBox: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        terrain: Cesium.Terrain.fromWorldTerrain(),
        // baseLayer:
        //         new Cesium.ImageryLayer(
        //         new Cesium.OpenStreetMapImageryProvider({
        //             url: 'https://a.tile.openstreetmap.org/'
        //         })
        //     )
            // new Cesium.ImageryLayer(
            //     new Cesium.WebMapTileServiceImageryProvider({
            //         url: getTdT(baseLayer[0], baseLayer[1]),
            //         layer: baseLayer[0],
            //         style: "default",
            //         format: "image/jpeg",
            //         tileMatrixSetID: baseLayer[1],
            //     })
            // ),
    });
    (viewerName.cesiumWidget.creditContainer as HTMLDivElement).style.display = //隐藏数据来源
        "none"; //viewer.cesiumWidget.creditContainer声明HTMLdiv容器避免TS编译器报错

    // viewerName.scene.skyBox.show = false; //隐藏天空盒
    viewerName.scene.backgroundColor = Cesium.Color.TRANSPARENT; //隐藏背景
    viewerName.scene.sun.show = false; //隐藏太阳
    viewerName.scene.moon.show = false; //隐藏月亮
    viewerName.scene.skyBox = new Cesium.SkyBox({
        sources: {
            positiveX: '/public/SkyBOX/px.png',
            negativeX: '/public/SkyBOX/nx.png',
            positiveY: '/public/SkyBOX/pz.png',
            negativeY: '/public/SkyBOX/nz.png',
            positiveZ: '/public/SkyBOX/py.png',
            negativeZ: '/public/SkyBOX/ny.png',
        }
    });
    return viewerName; //返回viewer
}