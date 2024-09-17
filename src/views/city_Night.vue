<template>
    <header id="header">
        <h3 class="header-title">城市三维场景</h3>
    </header>
    <Viewer_Night></Viewer_Night>
    <popup_info></popup_info>
    <footer id="footer"></footer>
</template>

<script setup lang="ts">
import Viewer_Night from '../components/map_view/Viewer_Night.vue';
import popup_info from '../components/map_view/popup_info.vue';
</script>

<style scoped></style>
