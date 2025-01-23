<template>
  <div class="mine-sweeper">
    <div class="game-info">
      <div class="status-display">
        <div class="mines-counter">💣 {{ remainingMines }}</div>
        <div class="time-status">
          <span class="game-status">{{ gameStatus }}</span>
          <span class="timer">⏰ {{ formattedTime }}</span>
        </div>
      </div>
      <div class="controls">
        <button
            class="control-btn start-btn"
            @click="togglePause"
            :style="buttonStyles.start"
        >
          {{ isPaused ? '开始游戏' : '暂停游戏' }}
        </button>
        <button
            class="control-btn restart-btn"
            @click="initGame"
            :style="buttonStyles.restart"
        >
          重新开始
        </button>
      </div>
    </div>

    <div class="grid">
      <div
          v-for="(row, x) in grid"
          :key="x"
          class="row"
      >
        <div
            v-for="(cell, y) in row"
            :key="y"
            class="cell"
            :class="{
            'revealed': cell.revealed,
            'mine': cell.isMine && gameOver,
            'flagged': cell.flagged,
            'question': cell.question,
            'paused': isPaused,
            'blink': cell.blink
          }"
            @click.left="handleReveal(x, y)"
            @click.right.prevent="handleFlag(x, y)"
            @dblclick.prevent="handleDoubleClick(x, y)"
            :data-x="x"
            :data-y="y"
        >
          <template v-if="cell.revealed || (gameOver && cell.isMine)">
            <span v-if="cell.isMine" class="mine-icon">💣</span>
            <span v-else-if="cell.neighborMines > 0" :class="'number-' + cell.neighborMines">
              {{ cell.neighborMines }}
            </span>
          </template>
          <template v-else>
            <span v-if="cell.flagged" class="flag-icon">🚩</span>
            <span v-if="cell.question" class="question-mark">?</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watchEffect } from 'vue'

interface Cell {
  isMine: boolean
  revealed: boolean
  flagged: boolean
  question: boolean
  neighborMines: number
  blink: boolean
}

const SIZE = 10
const MINES = 10

// 游戏状态
const grid = reactive<Cell[][]>([])
const gameOver = ref(false)
const victory = ref(false)
const firstClick = ref(true)
const isPaused = ref(true)
const elapsedTime = ref(0)
let timer: NodeJS.Timeout | null = null

// 按钮样式
const buttonStyles = reactive({
  start: {
    backgroundColor: '#4CAF50',
    color: 'white'
  },
  restart: {
    backgroundColor: '#2196F3',
    color: 'white'
  }
})

// 初始化游戏
const initGame = () => {
  elapsedTime.value = 0
  isPaused.value = true
  gameOver.value = false
  victory.value = false
  firstClick.value = true

  grid.splice(0, grid.length)
  for (let x = 0; x < SIZE; x++) {
    const row: Cell[] = []
    for (let y = 0; y < SIZE; y++) {
      row.push({
        isMine: false,
        revealed: false,
        flagged: false,
        question: false,
        neighborMines: 0,
        blink: false
      })
    }
    grid.push(row)
  }
}

// 生成地雷
const placeMines = (safeX: number, safeY: number) => {
  let minesPlaced = 0
  while (minesPlaced < MINES) {
    const x = Math.floor(Math.random() * SIZE)
    const y = Math.floor(Math.random() * SIZE)

    if (!grid[x][y].isMine &&
        Math.abs(x - safeX) > 1 &&
        Math.abs(y - safeY) > 1) {
      grid[x][y].isMine = true
      minesPlaced++
    }
  }
  calculateNumbers()
}

// 计算数字
const calculateNumbers = () => {
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      if (!grid[x][y].isMine) {
        grid[x][y].neighborMines = countNeighborMines(x, y)
      }
    }
  }
}

const countNeighborMines = (x: number, y: number): number => {
  let count = 0
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const nx = x + dx
      const ny = y + dy
      if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
        if (grid[nx][ny].isMine) count++
      }
    }
  }
  return count
}

// 揭开所有地雷
const revealAllMines = () => {
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      if (grid[x][y].isMine) {
        grid[x][y].revealed = true
      }
    }
  }
}

// 揭开单元格
const reveal = (x: number, y: number) => {
  if (grid[x][y].isMine) {
    gameOver.value = true
    isPaused.value = true
    grid[x][y].revealed = true
    revealAllMines()
    return
  }

  floodReveal(x, y)
  checkVictory()
}

// 洪水填充算法
const floodReveal = (x: number, y: number) => {
  if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return
  if (grid[x][y].revealed) return
  if (grid[x][y].isMine) return

  grid[x][y].revealed = true

  if (grid[x][y].neighborMines === 0) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        floodReveal(x + dx, y + dy)
      }
    }
  }
}

// 处理点击
const handleReveal = (x: number, y: number) => {
  if (gameOver.value || isPaused.value || grid[x][y].flagged) return

  if (firstClick.value) {
    firstClick.value = false
    placeMines(x, y)
    isPaused.value = false
  }

  reveal(x, y)
}

const handleFlag = (x: number, y: number) => {
  if (gameOver.value || isPaused.value || grid[x][y].revealed) return

  if (!grid[x][y].flagged && !grid[x][y].question) {
    grid[x][y].flagged = true
  } else if (grid[x][y].flagged) {
    grid[x][y].flagged = false
    grid[x][y].question = true
  } else {
    grid[x][y].question = false
  }
}

// 新增双击处理
const handleDoubleClick = (x: number, y: number) => {
  if (isPaused.value || gameOver.value) return

  const cell = grid[x][y]
  if (!cell.revealed || cell.neighborMines === 0) return

  // 获取周围单元格
  const neighbors = []
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue
      const nx = x + dx
      const ny = y + dy
      if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) {
        neighbors.push({ nx, ny })
      }
    }
  }

  // 触发闪烁效果
  neighbors.forEach(({ nx, ny }) => {
    const neighborCell = grid[nx][ny]
    if (!neighborCell.revealed && !neighborCell.flagged) {
      blinkCell(nx, ny)
    }
  })
}

// 闪烁动画
const blinkCell = (x: number, y: number) => {
  grid[x][y].blink = true
  setTimeout(() => {
    grid[x][y].blink = false
  }, 400)
}

// 游戏控制
const togglePause = () => {
  if (gameOver.value) return
  isPaused.value = !isPaused.value
}

const checkVictory = () => {
  let unrevealedSafeCells = 0
  for (let x = 0; x < SIZE; x++) {
    for (let y = 0; y < SIZE; y++) {
      if (!grid[x][y].isMine && !grid[x][y].revealed) {
        unrevealedSafeCells++
      }
    }
  }
  victory.value = unrevealedSafeCells === 0
  if (victory.value) {
    gameOver.value = true
    isPaused.value = true
  }
}

// 计算属性
const remainingMines = computed(() => {
  let flaggedMines = 0
  grid.forEach(row => {
    row.forEach(cell => {
      if (cell.flagged) flaggedMines++
    })
  })
  return MINES - flaggedMines
})

const gameStatus = computed(() => {
  if (victory.value) return '胜利! 🎉'
  if (gameOver.value) return '游戏结束! 💥'
  return isPaused.value ? '已暂停' : '游戏中...'
})

const formattedTime = computed(() => {
  const minutes = Math.floor(elapsedTime.value / 60)
  const seconds = elapsedTime.value % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

// 计时器逻辑
watchEffect((onCleanup) => {
  if (!isPaused.value && !gameOver.value && !victory.value) {
    timer = setInterval(() => {
      elapsedTime.value++
    }, 1000)
  } else {
    if (timer) clearInterval(timer)
  }

  onCleanup(() => {
    if (timer) clearInterval(timer)
  })
})

// 初始化
onMounted(initGame)
</script>

<style scoped>
.mine-sweeper {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial Rounded MT Bold', Arial, sans-serif;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

.game-info {
  margin-bottom: 20px;
  text-align: center;
}

.status-display {
  background: white;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  width: 300px;
}

.mines-counter {
  font-size: 24px;
  font-weight: bold;
  color: #d32f2f;
  margin-bottom: 8px;
}

.time-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-status {
  font-size: 18px;
  color: #666;
}

.timer {
  font-size: 18px;
  color: #666;
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

.controls {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.control-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
  min-width: 120px;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.2);
}

.start-btn {
  background: #4CAF50;
}

.restart-btn {
  background: #2196F3;
}

.grid {
  display: grid;
  grid-template-rows: repeat(10, 35px);
  grid-template-columns: repeat(10, 35px);
  gap: 2px;
  background: #999;
  padding: 3px;
  border-radius: 5px;
  border: 3px solid #999;
}

.row {
  display: contents;
}

.cell {
  background: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  user-select: none;
  transition:
      background 0.3s,
      transform 0.1s;
  border-radius: 3px;
  font-size: 16px;
}

.cell.paused {
  background: #aaa;
}

.cell:hover:not(.paused) {
  background: #bbb;
  transform: scale(1.05);
}

.revealed {
  background: #e0e0e0 !important;
}

.mine {
  background: #ff4444 !important;
  animation: mine-reveal 0.3s ease-out;
}

.flagged {
  background: #90CAF9;
}

.question {
  background: #FFE082;
}

.blink {
  animation: blink 0.2s 2;
}

@keyframes blink {
  0% { background-color: #ccc; }
  50% { background-color: #8c8c8c; }
  100% { background-color: #ccc; }
}

.number-1 { color: #1976D2; }
.number-2 { color: #388E3C; }
.number-3 { color: #d32f2f; }
.number-4 { color: #7B1FA2; }
.number-5 { color: #FFA000; }
.number-6 { color: #00796B; }
.number-7 { color: #616161; }
.number-8 { color: #9E9E9E; }

.mine-icon {
  font-size: 22px;
  animation: bounce 0.5s;
}

.flag-icon {
  font-size: 18px;
  color: #d32f2f;
}

.question-mark {
  color: #666;
  font-weight: bold;
}

@keyframes mine-reveal {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
</style>
