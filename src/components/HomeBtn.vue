<script setup lang="ts">
import HomeIcon from "@/components/icon/HomeIcon.vue";
</script>

<template>
  <div class="game-name">
    <HomeIcon/>
  </div>
</template>

<style scoped lang="less">
@import "@/assets/basic.less";

.game-name {
  .tab-box();
}
</style>
