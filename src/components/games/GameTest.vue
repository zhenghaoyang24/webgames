<template>
  <div class="game-container">
    <h1>猜拳游戏</h1>

    <!-- 游戏状态栏 -->
    <div class="game-status">
      <p>玩家选择: {{ playerChoice || '未选择' }}</p>
      <p>电脑选择: {{ computerChoice || '未选择' }}</p>
      <p>结果: {{ result }}</p>
      <p>得分: {{ score }}</p>
    </div>

    <!-- 玩家选择按钮 -->
    <div class="choices">
      <button @click="play('石头')">✊ 石头</button>
      <button @click="play('剪刀')">✌️ 剪刀</button>
      <button @click="play('布')">✋ 布</button>
    </div>

    <!-- 重置按钮 -->
    <button class="reset-button" @click="resetGame">重置游戏</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 游戏状态
const playerChoice = ref('')
const computerChoice = ref('')
const result = ref('')
const score = ref(0)

// 电脑随机选择
const getComputerChoice = () => {
  const choices = ['石头', '剪刀', '布']
  const randomIndex = Math.floor(Math.random() * choices.length)
  return choices[randomIndex]
}

// 判断游戏结果
const getResult = (player, computer) => {
  if (player === computer) {
    return '平局！'
  }
  if (
      (player === '石头' && computer === '剪刀') ||
      (player === '剪刀' && computer === '布') ||
      (player === '布' && computer === '石头')
  ) {
    score.value += 1
    return '你赢了！'
  }
  score.value -= 1
  return '你输了！'
}

// 玩家出拳
const play = (choice) => {
  playerChoice.value = choice
  computerChoice.value = getComputerChoice()
  result.value = getResult(playerChoice.value, computerChoice.value)
}

// 重置游戏
const resetGame = () => {
  playerChoice.value = ''
  computerChoice.value = ''
  result.value = ''
  score.value = 0
}
</script>

<style lang="less">
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.game-status {
  text-align: center;
  margin-bottom: 20px;
  p {
    margin: 5px 0;
    font-size: 18px;
    color: #555;
  }
}

.choices {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  button {
    padding: 15px 20px;
    font-size: 18px;
    border: none;
    border-radius: 5px;
    background-color: #2196f3;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #1976d2;
    }
  }
}

.reset-button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #f44336;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #d32f2f;
  }
}
</style>
