<template>
  <div class="tic-tac-toe-game">
    <div class="game-status">
      <div v-if="winner === 'draw'" class="game-result">平局！</div>
      <div v-else-if="winner" class="game-result">
        玩家 <span :class="['player-marker', `player-${winner.toLowerCase()}`]">{{ winner }}</span> 获胜！
      </div>
      <div v-else class="current-turn">
        当前玩家：<span :class="['player-marker', `player-${currentPlayer.toLowerCase()}`]">{{ currentPlayer }}</span>
      </div>
    </div>
    <div class="game-board">
      <div
          v-for="(cell, index) in board"
          :key="index"
          class="cell"
          :class="{ 'player-x': cell === 'X', 'player-o': cell === 'O' }"
          @click="handleCellClick(index)"
      >
        {{ cell }}
      </div>
    </div>
    <div class="game-controls">
      <button class="restart-button" @click="restartGame">重新开始</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

type Player = 'X' | 'O' | null;
type Winner = Player | 'draw';

const board = ref<Player[]>(Array(9).fill(null));
const currentPlayer = ref<Player>('X');
const winner = ref<Winner>(null);

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkWinner = (): Winner => {
  for (const [a, b, c] of winningCombinations) {
    if (board.value[a] && board.value[a] === board.value[b] && board.value[a] === board.value[c]) {
      return board.value[a];
    }
  }
  if (board.value.every(cell => cell !== null)) {
    return 'draw';
  }
  return null;
};

const handleCellClick = (index: number) => {
  if (board.value[index] || winner.value) return;

  board.value[index] = currentPlayer.value;
  const result = checkWinner();
  
  if (result) {
    winner.value = result;
  } else {
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';
  }
};

const restartGame = () => {
  board.value = Array(9).fill(null);
  currentPlayer.value = 'X';
  winner.value = null;
};

onMounted(() => {
  restartGame();
});
</script>

<style lang="less" scoped>
.tic-tac-toe-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  padding: 20px;
}

.game-status {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;

  .game-result {
    color: #4caf50;
    font-size: 24px;
  }

  .current-turn {
    color: #333;
  }

  .player-marker {
    font-size: 28px;
    font-weight: bold;
    padding: 0 5px;

    &.player-x {
      color: #2196f3;
    }

    &.player-o {
      color: #f44336;
    }
  }
}

.game-board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  gap: 10px;
  background-color: #333;
  padding: 10px;
  border-radius: 10px;
  user-select: none;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  font-size: 48px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }

  &.player-x {
    color: #2196f3;
  }

  &.player-o {
    color: #f44336;
  }

  &.player-x,
  &.player-o {
    cursor: not-allowed;

    &:hover {
      background-color: #fff;
    }
  }
}

.game-controls {
  margin-top: 20px;

  .restart-button {
    padding: 12px 30px;
    font-size: 18px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #00bcd4;
    color: white;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0097a7;
    }
  }
}
</style>
