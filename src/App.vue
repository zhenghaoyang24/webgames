<script setup>
import Minesweeper from "@/components/games/Minesweeper.vue";
import NavBar from "@/components/NavBar.vue";
import SnakeGame from "@/components/games/SnakeGame.vue";

</script>

<template>
  <nav>
    <NavBar></NavBar>
  </nav>
  <main class="main">
    <SnakeGame></SnakeGame>
    <Minesweeper></Minesweeper>
  </main>
</template>

<style scoped>
.main{
  padding-top: 60px;
}
</style>
