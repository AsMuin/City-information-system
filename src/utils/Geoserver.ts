import axios from "axios";
import { ElMessage } from "element-plus";
const baseURL = '/geoserver';
const BaseUrl = axios.create({baseURL})

interface GeoFeature {
    type: string;
    features: Feature[];
    totalFeatures: number;
    numberMatched: number;
    numberReturned: number;
    timeStamp: string;
    crs: Crs;
}

interface Crs {
    type: string;
    properties: Properties2;
}

interface Properties2 {
    name: string;
}

interface Feature {
    type: string;
    id: string;
    geometry: Geometry;
    geometry_name: string;
    properties: Properties;
}

interface Properties {
    id: number;
    Popu: number;
}

interface Geometry {
    type: string;
    coordinates: number[];
}
export function Geoserver_WFS(workSpace: string, layerName: string):Promise<any>{
   return BaseUrl.get(
        `/${workSpace}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${workSpace}:${layerName}&maxFeatures=50000&outputFormat=application/json`
    ).catch((err) => {
        ElMessage.error("获取数据失败,地图服务异常");
    });
}

