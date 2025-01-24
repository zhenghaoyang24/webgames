<template>
  <div class="game-2048">
    <div class="header">
      <div class="score">分数: {{ score }}</div>
      <button @click="resetGame" class="reset-button">重开一局。</button>
    </div>
    <div class="grid">
      <div v-for="(row, i) in grid" :key="i" class="row">
        <div
            v-for="(cell, j) in row"
            :key="j"
            :class="['cell', `cell-${cell}`]"
        >
          {{ cell !== 0 ? cell : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// 游戏网格
const grid = ref([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

// 分数
const score = ref(0);

// 初始化游戏
const initializeGame = () => {
  grid.value = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score.value = 0;
  addRandomTile();
  addRandomTile();
};

// 添加随机数字（2 或 4）
const addRandomTile = () => {
  const emptyCells = [];
  grid.value.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) {
        emptyCells.push({ i, j });
      }
    });
  });

  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // 90% 的概率生成 2，10% 的概率生成 4
    grid.value[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;
  }
};

// 移动逻辑
const move = (direction) => {
  let moved = false;
  const newGrid = JSON.parse(JSON.stringify(grid.value));

  const rotateGrid = (grid) => {
    return grid[0].map((_, i) => grid.map((row) => row[i]).reverse());
  };

  const moveLeft = (grid) => {
    for (let i = 0; i < 4; i++) {
      let row = grid[i].filter((x) => x !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          score.value += row[j];
          row[j + 1] = 0;
          moved = true;
        }
      }
      row = row.filter((x) => x !== 0);
      while (row.length < 4) {
        row.push(0);
      }
      if (!arraysEqual(grid[i], row)) {
        moved = true;
      }
      grid[i] = row;
    }
    return grid;
  };

  // 辅助函数：比较两个数组是否相等
  const arraysEqual = (a, b) => {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  switch (direction) {
    case 'left':
      grid.value = moveLeft(newGrid);
      break;
    case 'right':
      grid.value = moveLeft(newGrid.map((row) => row.reverse())).map((row) => row.reverse());
      break;
    case 'up':
      grid.value = rotateGrid(moveLeft(rotateGrid(newGrid)));
      break;
    case 'down':
      grid.value = rotateGrid(moveLeft(rotateGrid(newGrid).map((row) => row.reverse()))).map((row) => row.reverse());
      break;
  }

  if (moved) {
    addRandomTile();
  }
};

// 重置游戏
const resetGame = () => {
  initializeGame();
};

// 键盘事件监听
const handleKeyDown = (event) => {
  const directions = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };
  if (directions[event.key]) {
    move(directions[event.key]);
  }
};

// 生命周期钩子
onMounted(() => {
  initializeGame();
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style lang="less">
.game-2048 {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;

  .header {
    margin-bottom: 20px;

    h1 {
      font-size: 48px;
      margin: 0;
    }

    .score {
      font-size: 24px;
      margin: 10px 0;
    }

    .reset-button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      background-color: #8f7a66;
      color: white;
      border: none;
      border-radius: 5px;
      &:hover {
        background-color: #9c8a77;
      }
    }
  }

  .grid {
    display: inline-block;
    background-color: #bbada0;
    padding: 10px;
    border-radius: 10px;

    .row {
      display: flex;
    }

    .cell {
      width: 100px;
      height: 100px;
      margin: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      font-weight: bold;
      background-color: #cdc1b4;
      border-radius: 5px;
      color: #776e65;

      &-2 {
        background-color: #eee4da;
      }
      &-4 {
        background-color: #ede0c8;
      }
      &-8 {
        background-color: #f2b179;
      }
      &-16 {
        background-color: #f59563;
      }
      &-32 {
        background-color: #f67c5f;
      }
      &-64 {
        background-color: #f65e3b;
      }
      &-128 {
        background-color: #edcf72;
      }
      &-256 {
        background-color: #edcc61;
      }
      &-512 {
        background-color: #edc850;
      }
      &-1024 {
        background-color: #edc53f;
      }
      &-2048 {
        background-color: #edc22e;
      }
    }
  }
}
</style>
