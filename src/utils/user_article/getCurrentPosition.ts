export default async function getLocation() {
    navigator.geolocation.getCurrentPosition(
        (res) => {
            console.log("获取位置成功:", res);
            return Promise.resolve([res.coords.longitude, res.coords.latitude])
        },
        (err) => {
            console.log("获取位置失败:", err);
            return Promise.rejected(err)
        },
    )
}