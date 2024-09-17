import * as Cesium from 'cesium';

export function loadJson(viewer:Cesium.Viewer,code:number) {
    viewer.dataSources.add(
        Cesium.GeoJsonDataSource.load(`https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`, {
            //编辑线的颜色
            stroke: Cesium.Color.RED,
            //编辑填充的颜色
            fill: Cesium.Color.fromCssColorString("#53CF88").withAlpha(0.5),
            //编辑线的宽度
            strokeWidth: 4,
            //是否贴地
            // clampToGround: true,
        })
    )
   
}