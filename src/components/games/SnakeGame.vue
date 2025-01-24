<template>
  <div class="snake-game">
    <!-- 游戏信息 -->
    <div class="game-info">
      <span>分数: {{ score }}</span>
      <span>时间: {{ gameTime }}s</span>
    </div>

    <!-- 控制按钮 -->
    <div class="game-controls">
      <button
          @click="toggleGame"
          :style="{
          backgroundColor: isPlaying ? '#ff4b2b' : '#4caf50',
        }"
      >
        {{ isPlaying ? '暂停' : '开始' }}
      </button>
      <button @click="restartGame" class="restart-button">重新开始</button>
    </div>

    <!-- 游戏区域 -->
    <div class="game-area">
      <div
          v-for="(row, y) in gameGrid"
          :key="y"
          class="game-row"
      >
        <div
            v-for="(cell, x) in row"
            :key="x"
            class="game-cell"
            :class="{ snake: cell === 1, food: cell === 2 }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 游戏配置
const GRID_SIZE = 20; // 网格大小
const CELL_SIZE = 20; // 每个格子的大小
const INITIAL_SPEED = 200; // 初始速度（毫秒）

// 游戏状态
const gameGrid = ref<number[][]>([]); // 游戏网格
const snake = ref<{ x: number; y: number }[]>([]); // 蛇的身体
const direction = ref<{ x: number; y: number }>({ x: 1, y: 0 }); // 蛇的移动方向
const food = ref<{ x: number; y: number }>({ x: 0, y: 0 }); // 食物的位置
const score = ref(0); // 分数
const gameTime = ref(0); // 游戏时间
const isPlaying = ref(false); // 是否正在游戏
const gameInterval = ref<number | null>(null); // 游戏循环
const isGameOver = ref(false); // 游戏是否结束

// 初始化游戏网格
const initGameGrid = () => {
  gameGrid.value = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => 0)
  );
};

// 初始化蛇
const initSnake = () => {
  snake.value = [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }];
  updateGrid();
};

// 生成食物
const generateFood = () => {
  let x, y;
  do {
    x = Math.floor(Math.random() * GRID_SIZE);
    y = Math.floor(Math.random() * GRID_SIZE);
  } while (gameGrid.value[y][x] !== 0);
  food.value = { x, y };
  gameGrid.value[y][x] = 2;
};

// 更新游戏网格
const updateGrid = () => {
  initGameGrid(); // 清空网格
  // 渲染蛇
  snake.value.forEach((segment) => {
    gameGrid.value[segment.y][segment.x] = 1;
  });
  // 渲染食物
  gameGrid.value[food.value.y][food.value.x] = 2;
};

// 移动蛇
const moveSnake = () => {
  const head = { ...snake.value[0] };
  head.x += direction.value.x;
  head.y += direction.value.y;

  // 检查是否撞墙或撞到自己
  if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE ||
      gameGrid.value[head.y][head.x] === 1
  ) {
    endGame();
    return;
  }

  // 检查是否吃到食物
  if (head.x === food.value.x && head.y === food.value.y) {
    score.value += 10;
    snake.value.unshift(head);
    generateFood();
  } else {
    snake.value.unshift(head);
    snake.value.pop();
  }

  updateGrid();
};

// 开始游戏
const startGame = () => {
  if (isGameOver.value) {
    // 如果游戏结束，重置状态
    isGameOver.value = false;
    score.value = 0;
    gameTime.value = 0;
    initSnake();
    generateFood();
  }

  if (!isPlaying.value) {
    isPlaying.value = true;
    gameInterval.value = setInterval(() => {
      moveSnake();
      gameTime.value++;
    }, INITIAL_SPEED);
  }
};

// 暂停游戏
const pauseGame = () => {
  if (isPlaying.value) {
    isPlaying.value = false;
    if (gameInterval.value) {
      clearInterval(gameInterval.value);
      gameInterval.value = null;
    }
  }
};

// 切换游戏状态
const toggleGame = () => {
  if (isPlaying.value) {
    pauseGame();
  } else {
    startGame();
  }
};

// 重新开始游戏
const restartGame = () => {
  pauseGame(); // 暂停当前游戏
  isGameOver.value = false;
  score.value = 0;
  gameTime.value = 0;
  initSnake();
  generateFood();
};

// 结束游戏
const endGame = () => {
  pauseGame();
  isGameOver.value = true;
  alert(`游戏结束！你的分数是：${score.value}`);
};

// 监听键盘事件
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === ' ' && !isGameOver.value) {
    // 空格键切换游戏状态
    toggleGame();
  }

  if (!isPlaying.value) return;

  switch (event.key) {
    case 'ArrowUp':
      if (direction.value.y === 0) direction.value = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.value.y === 0) direction.value = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.value.x === 0) direction.value = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.value.x === 0) direction.value = { x: 1, y: 0 };
      break;
  }
};

// 生命周期钩子
onMounted(() => {
  initGameGrid(); // 初始化网格
  initSnake(); // 初始化蛇
  generateFood(); // 生成食物
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  if (gameInterval.value) {
    clearInterval(gameInterval.value);
  }
});
</script>

<style lang="less" scoped>
.snake-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  padding: 20px;
  color: #333;
}

.game-info {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
}

.game-controls {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;

  button {
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    border: none;
    outline: none;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
  }

  .restart-button {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
  }
}

.game-area {
  display: flex;
  flex-direction: column;
  border: 2px solid #ddd;
  background: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
}

.game-row {
  display: flex;
}

.game-cell {
  width: 20px;
  height: 20px;
  border: 1px solid #eee;
}

.snake {
  background: #4caf50;
  border-radius: 4px;
}

.food {
  background: #ff4b2b;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
