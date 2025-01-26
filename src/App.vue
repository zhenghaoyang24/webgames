<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import GameList from './components/GameList.vue';
import NavBar from "@/components/NavBar.vue";
import { games } from "@/data/gameList.ts";
import GameDetail from "@/components/GameDetail.vue";
import Introduce from "@/components/Introduce.vue";
import HomeBtn from "@/components/HomeBtn.vue"; // 导入游戏列表

// 当前选择的游戏组件
const currentGame = shallowRef<any>(null);
// 主页按钮点击事件
const toHomeFn = () => {
  currentGame.value = null;
}
// 游戏介绍
const gameName = ref<string>('游戏名')
const gameDescription = ref<string>('游戏介绍')
// 处理选择游戏
const handleSelectGame = async (component: string) => {
  const game = games.find((g) => g.component === component);
  if (game) {
    try {
      const loadedComponent = await game.loadComponent(); // 动态加载组件
      currentGame.value = loadedComponent.default; // 获取组件的默认导出
      gameName.value = game.name;
      gameDescription.value = game.description;
    } catch (error) {
      console.error('加载游戏组件失败:', error);
      currentGame.value = null;
    }
  } else {
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
    <div class="left-ctrl-content">
      <GameList @select-game="handleSelectGame" />
      <GameDetail v-if="currentGame" :description="gameDescription" :name="gameName" />
      <HomeBtn @click="toHomeFn" v-if="currentGame"/>
    </div>
    <keep-alive>
      <component :is="currentGame" />
    </keep-alive>
    <div v-if="!currentGame" class="start-content">
      <Introduce/>
    </div>
  </main>
</template>

<style scoped>
.left-ctrl-content{
  display: flex;
  flex-direction: column;
  position: fixed;
  margin: 10px;
  >div{
    margin-top: 8px;
  }
}
.main {
  padding-top: 60px;
}

.start-content {
  display: flex;
  justify-content: center;
}
</style>
