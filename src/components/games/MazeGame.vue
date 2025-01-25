<template>
  <div class="maze-game">
    <!-- 控制栏 -->
    <div class="control-bar">
      <div class="game-time">时间: {{ formatTime(gameTime) }}</div>
      <div class="controls">
        <button
            class="start-pause-btn"
            :class="{ paused: isPaused }"
            @click="togglePause"
        >
          {{ isPaused ? "开始游戏" : "暂停游戏" }}
        </button>
        <button class="change-maze-btn" @click="generateNewMaze">新迷宫</button>
      </div>
    </div>

    <!-- 迷宫区域 -->
    <div class="maze-container">
      <div
          v-for="(row, rowIndex) in maze"
          :key="rowIndex"
          class="maze-row"
      >
        <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            class="maze-cell"
            :class="{ wall: cell === 1, path: cell === 0 }"
        >
          <span
              v-if="rowIndex === player.row && colIndex === player.col"
              class="player-icon"
          >👦</span>
          <span
              v-if="rowIndex === exit.row && colIndex === exit.col"
              class="exit-icon"
          >🚩</span>
        </div>
      </div>

      <!-- 状态遮罩层 -->
      <div v-if="isPaused || isGameOver" class="state-overlay">
        <div class="overlay-content">
          <div v-if="isPaused && !isGameOver" class="pause-text">
            ⏸ 游戏已暂停
          </div>
          <div v-if="isGameOver" class="victory-message">
            🎉 通关成功！耗时 {{ formatTime(gameTime) }}
          </div>
          <button
              v-if="isGameOver"
              class="restart-btn"
              @click="generateNewMaze"
          >
            再玩一次
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 迷宫生成算法
const generateMaze = (size = 30) => {
  const grid = Array(size).fill().map(() => Array(size).fill(1));
  grid[1][1] = 0;
  const walls = getNeighborWalls(1, 1, grid);

  while (walls.length > 0) {
    const wallIndex = Math.floor(Math.random() * walls.length);
    const { x, y, px, py } = walls[wallIndex];
    walls.splice(wallIndex, 1);

    if (grid[py][px] === 1) {
      grid[y][x] = 0;
      grid[py][px] = 0;
      walls.push(...getNeighborWalls(px, py, grid));
    }
  }

  grid[size - 2][size - 2] = 0;
  return grid;
};

const getNeighborWalls = (x, y, grid) => {
  const dirs = [
    { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
    { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
  ];
  const walls = [];
  const size = grid.length;

  dirs.forEach(({ dx, dy }) => {
    const nx = x + dx * 2;
    const ny = y + dy * 2;
    if (nx >= 0 && nx < size && ny >= 0 && ny < size && grid[ny][nx] === 1) {
      walls.push({ x: x + dx, y: y + dy, px: nx, py: ny });
    }
  });

  return walls;
};

// 游戏状态管理
const mazeSize = 31;
const maze = ref(generateMaze(mazeSize));
const isPaused = ref(true);
const isGameOver = ref(false);
const gameTime = ref(0);
let timer = null;

// 玩家位置
const player = ref({ row: 1, col: 1 });

// 出口位置
const exit = ref({
  row: maze.value.length - 2,
  col: maze.value[0].length - 2
});

// 时间格式化
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// 游戏控制
const togglePause = () => {
  isPaused.value = !isPaused.value;
  if (isPaused.value) {
    clearInterval(timer);
  } else {
    if (isGameOver.value) {
      isGameOver.value = false;
      gameTime.value = 0;
    }
    timer = setInterval(() => gameTime.value++, 1000);
  }
};

const generateNewMaze = () => {
  maze.value = generateMaze(mazeSize);
  exit.value = {
    row: maze.value.length - 2,
    col: maze.value[0].length - 2
  };
  resetGameState();
};

const resetGameState = () => {
  player.value = { row: 1, col: 1 };
  isGameOver.value = false;
  gameTime.value = 0;
  isPaused.value = true;
};

// 玩家移动控制
const handleKeydown = (e) => {
  if (isPaused.value || isGameOver.value) return;

  const moves = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1]
  };

  if (moves[e.key]) {
    const [dr, dc] = moves[e.key];
    const newRow = player.value.row + dr;
    const newCol = player.value.col + dc;

    if (newRow >= 0 && newRow < mazeSize &&
        newCol >= 0 && newCol < mazeSize &&
        maze.value[newRow][newCol] === 0) {
      player.value = { row: newRow, col: newCol };

      // 检查是否到达终点
      if (newRow === exit.value.row && newCol === exit.value.col) {
        clearInterval(timer);
        isGameOver.value = true;
        isPaused.value = true;
      }
    }
  }
};

// 生命周期
onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
</script>

<style lang="less" scoped>
.maze-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f0f2f5;
}

.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(30 * 18px + 20px);
  margin-bottom: 1.5rem;
  padding: 0 10px;

  .game-time {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
  }

  .controls {
    display: flex;
    gap: 0.8rem;

    button {
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 90px;

      &.start-pause-btn {
        background: #00c853;
        color: white;

        &.paused {
          background: #ff1744;
        }
      }

      &.change-maze-btn {
        background: #2979ff;
        color: white;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 6px rgba(0,0,0,0.1);
      }
    }
  }
}

.maze-container {
  position: relative;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.maze-row {
  display: flex;
}

.maze-cell {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &.wall {
    background: #37474f;
  }

  &.path {
    background: #fafafa;
  }

  .player-icon, .exit-icon {
    font-size: 16px;
    line-height: 1;
    display: block;
    margin: -1px 0 0 -1px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
    animation: float 2s ease-in-out infinite;
  }

  .exit-icon {
    font-size: 14px;
    color: #d32f2f;
  }
}

.state-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;

  .overlay-content {
    text-align: center;
    color: white;

    .pause-text {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .victory-message {
      font-size: 1.8rem;
      font-weight: bold;
      margin-bottom: 2rem;
      color: #ffee58;
      text-shadow: 0 0 8px rgba(255, 238, 88, 0.4);
    }

    .restart-btn {
      padding: 0.8rem 2rem;
      font-size: 1.1rem;
      background: #4caf50;
      border: none;
      border-radius: 25px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #43a047;
        transform: scale(1.05);
      }
    }
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
</style>
