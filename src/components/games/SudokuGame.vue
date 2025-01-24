<template>
  <div class="sudoku-container">
    <!-- 顶部显示游戏时间 -->
    <div class="game-info">
      <span>⏰ 时间: {{ formatTime(gameTime) }}</span>
    </div>

    <!-- 暂停按钮 -->
    <button @click="togglePause" class="pause-button" :class="{ 'paused': isPaused }">
      {{ isPaused ? '继续游戏' : '暂停游戏' }}
    </button>

    <!-- 数独棋盘 -->
    <div class="sudoku-board">
      <!-- 遮罩层 -->
      <div v-if="isPaused" class="board-mask">
        游戏暂停中......
      </div>

      <div v-for="(row, rowIndex) in board" :key="rowIndex" class="sudoku-row">
        <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            class="sudoku-cell"
            :class="{
            'fixed-cell': cell.fixed,
            'correct-cell': isCompleted && cell.value === solvedBoard[rowIndex][colIndex],
          }"
            @click="selectCell(rowIndex, colIndex)"
        >
          <input
              v-if="!cell.fixed && selectedCell?.row === rowIndex && selectedCell?.col === colIndex"
              v-model="cell.value"
              type="number"
              min="1"
              max="9"
              @input="validateInput(cell)"
              @blur="deselectCell"
          />
          <span v-else>{{ cell.value || '' }}</span>
        </div>
      </div>
    </div>

    <!-- 完成提示 -->
    <div v-if="isCompleted" class="completion-message">
      恭喜你，完成了！用时 {{ formatTime(gameTime) }}。
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

// 数独棋盘初始数据
const initialBoard = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

// 数独解答
const solvedBoard = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

// 数独棋盘
const board = ref(
    initialBoard.map((row) =>
        row.map((value) => ({
          value: value === 0 ? null : value,
          fixed: value !== 0, // 固定值不可修改
        }))
    )
);

// 当前选中的单元格
const selectedCell = ref<{ row: number; col: number } | null>(null);

// 游戏时间
const gameTime = ref(0);
let timer: number;

// 游戏是否完成
const isCompleted = ref(false);

// 游戏是否暂停
const isPaused = ref(true); // 默认暂停状态

// 格式化时间（秒 -> 分:秒）
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// 选择单元格
const selectCell = (row: number, col: number) => {
  if (!board.value[row][col].fixed && !isCompleted.value && !isPaused.value) {
    selectedCell.value = { row, col };
  }
};

// 取消选择单元格
const deselectCell = () => {
  selectedCell.value = null;
};

// 验证输入
const validateInput = (cell: { value: number | null }) => {
  if (cell.value !== null && (cell.value < 1 || cell.value > 9)) {
    cell.value = null;
  }
};

// 检查数独是否完成
const checkCompletion = () => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board.value[row][col].value !== solvedBoard[row][col]) {
        return false;
      }
    }
  }
  return true;
};

// 监听棋盘变化
watch(
    board,
    () => {
      if (checkCompletion()) {
        isCompleted.value = true;
        clearInterval(timer); // 停止计时器
      }
    },
    { deep: true }
);

// 暂停/继续游戏
const togglePause = () => {
  isPaused.value = !isPaused.value;
  if (isPaused.value) {
    clearInterval(timer); // 暂停计时器
  } else {
    timer = setInterval(() => {
      gameTime.value++;
    }, 1000); // 继续计时器
  }
};

// 启动游戏
onMounted(() => {
  // 默认暂停状态，不启动计时器
});
</script>

<style scoped>
.sudoku-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.game-info {
  font-size: 18px;
  margin-bottom: 10px;
}

.pause-button {
  margin-bottom: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: green; /* 默认绿色 */
  color: white;
  border: none;
  border-radius: 5px;
}

.pause-button.paused {
  background-color: red; /* 暂停时为红色 */
}

.sudoku-board {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 2px solid #000;
}

.board-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255); /* 白色遮罩 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #000;
  z-index: 1; /* 确保遮罩层位于棋盘内容之上 */
}

.sudoku-row {
  display: flex;
}

.sudoku-cell {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  font-size: 18px;
  position: relative;
  transition: background-color 1s ease;
}

.sudoku-cell.fixed-cell {
  background-color: #f0f0f0;
  font-weight: bold;
}

.sudoku-cell.correct-cell {
  background-color: #a8f0a8; /* 绿色背景 */
}

.sudoku-cell input {
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 18px;
  border: none;
  outline: none;
  background-color: transparent;
}

.completion-message {
  margin-top: 20px;
  font-size: 24px;
  color: green;
}
</style>
