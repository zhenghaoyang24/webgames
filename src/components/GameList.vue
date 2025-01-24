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

// 游戏列表数据
const games = [
  { name: '扫雷', component: 'Minesweeper' },
  { name: '贪吃蛇', component: 'SnakeGame' },
];

// 是否显示游戏列表
const showList = ref(false);

// 选择游戏
const emit = defineEmits(['select-game']);
const selectGame = (component: string) => {
  emit('select-game', component);
  showList.value = false; // 选择后隐藏列表
};
</script>

<style lang="less" scoped>
.game-list-container {
  position: fixed;
  display: inline-block;
  margin: 10px;
}

.game-list-title {
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  color: #565656;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.32);
}

.game-list {
  width: 100px;
  position: absolute;
  top: 0; /* 列表顶部与按钮对齐 */
  left: 100%; /* 列表显示在按钮右侧 */
  list-style: none;
  margin: 0;
  padding: 0;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
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
