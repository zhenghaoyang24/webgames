<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import GameList from './components/GameList.vue';
import Minesweeper from "@/components/games/Minesweeper.vue";
import NavBar from "@/components/NavBar.vue";
import SnakeGame from "@/components/games/SnakeGame.vue";
// 当前选择的游戏组件
const currentGame = shallowRef<any>(null);

// 处理选择游戏
const handleSelectGame = (component: string) => {
  switch (component) {
    case 'Minesweeper':
      currentGame.value = Minesweeper;
      break;
    case 'SnakeGame':
      currentGame.value = SnakeGame;
      break;
    default:
      currentGame.value = null;
  }
};
</script>

<template>
  <nav>
    <NavBar></NavBar>
  </nav>
  <main class="main">
    <!-- 游戏列表 -->
    <GameList @select-game="handleSelectGame" />
    <component :is="currentGame" />
  </main>
</template>

<style scoped>
.main{
  padding-top: 60px;
}
</style>
