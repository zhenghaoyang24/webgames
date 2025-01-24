<template>
  <div class="game-list-container" @mouseenter="showList = true" @mouseleave="showList = false">
    <!-- 游戏列表标题 -->
    <div class="game-list-title">
      <GameListIcon/>
    </div>

    <!-- 游戏列表 -->
    <transition name="fade">
      <ul v-if="showList" class="game-list">
        <li
            v-for="game in games"
            :key="game.name"
            @click="selectGame(game.component)"
            class="game-item"
        >
          {{ game.name }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GameListIcon from "@/components/icon/GameListIcon.vue";
import { games } from "@/data/gameList.ts"; // 导入游戏列表
// 是否显示游戏列表
const showList = ref(false);

// 选择游戏
const emit = defineEmits(['select-game']);
const selectGame = (component: string) => {
  emit('select-game', component);
  showList.value = false; // 选择后隐藏列表
};
</script>

<style scoped lang="less">
@import "@/assets/basic.less";
.game-list-container {
  .tab-content();

}

.game-list-title {
  .tab-box();
}

.game-list {
  .tab-transition();
}

.game-item {
  padding: 10px 20px;
  font-size: 16px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f0f0f0;
  }
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
