<template>
  <div class="game-detail" @mouseenter="showDescription = true" @mouseleave="showDescription = false">
    <!-- 游戏名称 -->
    <div class="game-name">
      <QuestionIcon/>
    </div>

    <!-- 游戏介绍（右侧显示） -->
    <transition name="fade">
      <div v-if="showDescription" class="game-description">
        {{ description }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QuestionIcon from "@/components/icon/QuestionIcon.vue";

// 定义 props
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

// 控制是否显示游戏介绍
const showDescription = ref(false);
</script>

<style scoped lang="less">
@import "@/assets/basic.less";

.game-detail {
  .tab-content();
}

.game-name {
  .tab-box();
}

.game-description {
  .tab-transition();
  width: 300px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px); /* 从左侧淡入 */
}
</style>
