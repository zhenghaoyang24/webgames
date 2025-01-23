<script setup>
import Minesweeper from "@/components/Minesweeper.vue";
import NavBar from "@/components/NavBar.vue";

</script>

<template>
  <nav>
    <NavBar></NavBar>
  </nav>

  <main class="main">
    <Minesweeper></Minesweeper>
  </main>
</template>

<style scoped>
.main{
  padding-top: 60px;
}
</style>
