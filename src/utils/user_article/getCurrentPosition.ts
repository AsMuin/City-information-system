import {ElMessage,ElMessageBox} from 'element-plus';
export default async function getLocation() {
    navigator.geolocation.getCurrentPosition(
        (res) => {
            console.log("获取位置成功:", res);
            return Promise.resolve([res.coords.longitude, res.coords.latitude])
        },
        (err) => {
            console.log("获取位置失败:", err);
            ElMessageBox.confirm('获取位置失败,请在浏览器设置允许获取地理位置', '提示', )
            return Promise.reject(err)
        },
    )
}