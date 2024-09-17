//*自定义hooks
import * as Cesium from 'cesium';
export function createBaseViewer(
    viewerName: Cesium.Viewer,
    viewerDiv: string,
    baseLayer?: Array<string>
) {
    // onMounted(() => {
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
        terrain: Cesium.Terrain.fromWorldTerrain()
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
    (viewerName.cesiumWidget.creditContainer as HTMLDivElement).style.display = 'none'; //隐藏数据来源 //viewer.cesiumWidget.creditContainer声明HTMLdiv容器避免TS编译器报错

    // viewerName.scene.skyBox.show = false; //隐藏天空盒
    viewerName.scene.backgroundColor = Cesium.Color.TRANSPARENT; //隐藏背景
    viewerName.scene.sun.show = false; //隐藏太阳
    viewerName.scene.moon.show = false; //隐藏月亮
    viewerName.scene.skyBox = new Cesium.SkyBox({
        sources: {
            positiveX: '/SkyBOX/px.png',
            negativeX: '/SkyBOX/nx.png',
            positiveY: '/SkyBOX/pz.png',
            negativeY: '/SkyBOX/nz.png',
            positiveZ: '/SkyBOX/py.png',
            negativeZ: '/SkyBOX/ny.png'
        }
    });

    // })
    return viewerName; //返回viewer
}
