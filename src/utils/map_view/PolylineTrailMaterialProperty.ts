/**
 *  精灵穿梭路光效果，
 *  entity的材质使用MaterialProperty,而primitive使用的是material。
 *  @Data：2022-01-11
 */
import * as Cesium from 'cesium';

export default function Spriteline1MaterialProperty(this: any, duration: any, image: any) {
    this._definitionChanged = new Cesium.Event();
    this.duration = duration;
    this.image = image || '/PolyLine_material/Line_Blue.jpg';
    this._time = performance.now();
}
Object.defineProperties(Spriteline1MaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false;
        }
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        }
    }
    // color: Cesium.createPropertyDescriptor("color"),
    // duration: Cesium.createPropertyDescriptor("duration"),
});
Spriteline1MaterialProperty.prototype.getType = function (time: any) {
    return 'Spriteline1';
};
Spriteline1MaterialProperty.prototype.getValue = function (
    time: any,
    result: {image?: any; time?: any}
) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.image = this.image;
    result.time = ((performance.now() - this._time) % this.duration) / this.duration;
    return result;
};
Spriteline1MaterialProperty.prototype.equals = function (e: {duration: any}) {
    return this === e || (e instanceof Spriteline1MaterialProperty && this.duration === e.duration);
};
// const CesiumExtensions = Object.assign({}, Cesium);
// CesiumExtensions.Spriteline1MaterialProperty = Spriteline1MaterialProperty;
// window.Cesium = CesiumExtensions;
// Cesium.Material.
const Spriteline1Type = 'Spriteline1';
// Cesium.Material.
const Spriteline1Source = `
czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));
    material.alpha = colorImage.a * color.a;
    material.diffuse = colorImage.rgb ;
    return material;
}
`;
// st :二维纹理坐标
// czm_material：保存可用于照明的材质信息
//@ts-ignore
Cesium.Material._materialCache.addMaterial(
    // Cesium.Material.
    Spriteline1Type,
    {
        fabric: {
            type:
                // Cesium.Material.
                Spriteline1Type,
            uniforms: {
                color: new Cesium.Color(1, 0, 0, 0.7),
                image: '',
                transparent: true,
                time: 20
            },
            source:
                // Cesium.Material.
                Spriteline1Source
        },
        translucent: function (material: any) {
            return true;
        }
    }
);
