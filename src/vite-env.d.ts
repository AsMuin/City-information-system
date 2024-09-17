/// <reference types="vite/client" />
interface Window {
    CESIUM_BASE_URL: string;
}

declare module 'cesium-heatmap' {
    const CesiumHeatmap: any;
    export default CesiumHeatmap;
}
declare module 'pinia-persistedstate-plugin' {
    const PiniaPersistedstatePlugin: any;
    export default PiniaPersistedstatePlugin;
}
