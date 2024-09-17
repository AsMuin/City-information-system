<template>
    <header id="header">
        <h3 class="header-title">城市三维场景</h3>
    </header>
    <Viewer_Day></Viewer_Day>
    <hawkEyeViewer></hawkEyeViewer>
    <popup_info></popup_info>
    <footer id="footer"></footer>
</template>

<script setup lang="ts">
import Viewer_Day from '../components/map_view/Viewer_Day.vue';
import hawkEyeViewer from '../components/map_view/hawkEyeViewer.vue';
import popup_info from '../components/map_view/popup_info.vue';
</script>

<style scoped></style>
