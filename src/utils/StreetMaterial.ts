import * as Cesium from 'cesium'
export function addStreet(Viewer: Cesium.Viewer, features: any,image:string) {

    const LINES = []
    for (let i = 0; i < features.length; i++) {
        for (let j = 0; j < features[i].geometry.coordinates.length; j++) {
            const positions = Cesium.Cartesian3.fromDegreesArray(
                features[i].geometry.coordinates[j].flat()
            )
            const polyline = new Cesium.GroundPolylineGeometry({ //设置成贴地的要素
                positions: positions,
                width: 2,
                // vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
            })
            const polyline_Instance = new Cesium.GeometryInstance({
                geometry: polyline,
                id: i
            })
            LINES.push(polyline_Instance)
        }
    }

    const material = new Cesium.Material({
        fabric: {
            type: 'Spriteline',
            uniforms: {
                color: Cesium.Color.WHITE,
                image: image,
                transparent: true,
                time: 0
            },
            source: `
        czm_material czm_getMaterial(czm_materialInput materialInput)
        {
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));
            material.alpha = colorImage.a * color.a;
            material.diffuse = colorImage.rgb ;
            return material;
        }
      `
        }
    })

    const polylinePrimitive = new Cesium.GroundPolylinePrimitive({
        geometryInstances: LINES,
        appearance: new Cesium.PolylineMaterialAppearance({
            // flat: true,
            material: material,

        })

    })
    Viewer.scene.primitives.add(polylinePrimitive);

    Viewer.clock.onTick.addEventListener(function (clock) {
        const startTime = Cesium.JulianDate.toDate(
            Viewer.clock.startTime
        ).getTime()
        const currentTime = Cesium.JulianDate.toDate(clock.currentTime).getTime()
        const elapsedTime = (currentTime - startTime) / 1000.0
        material.uniforms.time = elapsedTime
    })
    Viewer.clock.shouldAnimate = true
    return polylinePrimitive;
}