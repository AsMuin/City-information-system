export function getTdT(type: string, coor: string) {
  //天地图图层调用
  const tdt_Key: string = "97b849df49f1623dfd159e47d4dc6747";
  const tdt_BaseUrl: string = `https://t3.tianditu.com/${type}_${coor}/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=${type}&tileMatrixSet=${coor}&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${tdt_Key}`;
  return tdt_BaseUrl;
}
