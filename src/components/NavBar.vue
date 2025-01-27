<script setup lang="ts">

import LogoIcon from "@/components/icon/LogoIcon.vue";

const toGithub = () => {
  window.open(`https://github.com/zhenghaoyang24/webgames`, "_blank");
}
</script>

<template>
  <nav class="navbar">
    <div class="nav-logo">
        <LogoIcon/>
      WebGames
    </div>
    <div class="nav-ctrl">
      <span @click="toGithub">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
      </span>
    </div>
  </nav>
</template>

<style scoped lang="less">
.navbar {
  box-shadow: 0 0 10px 2px #dddddd;
  z-index: 999;
  position: fixed;
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  background-color: #ffffff;
  user-select: none;
  width: 100%;
  box-sizing: border-box;
  height: 60px;


  .nav-ctrl{
    display: flex;
    justify-content: space-between;
    align-items: center;
    >span{
      cursor: pointer;
      margin: 0 4px;
    }
  }

  .nav-logo{
    display: flex;
    align-items: center;
    font-weight: 900;
    font-size: large;
    color: black;
    svg{
      margin-right: 5px;
      width: 25px;
      height: 25px;
    }
  }
}

</style>
