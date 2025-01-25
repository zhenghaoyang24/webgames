<template>
  <div class="memory-card-game">
    <div class="game-info">
      <div>时间: {{ formatTime(gameTime) }}</div>
      <div>剩余卡片: {{ remainingCards }}</div>
    </div>
    <div class="game-controls">
      <button @click="togglePause">{{ isPaused ? '开始' : '暂停' }}</button>
      <button @click="restartGame">重开一局</button>
    </div>
    <div class="game-board">
      <div
          v-for="(card, index) in cards"
          :key="index"
          class="card"
          :class="{ flipped: card.isFlipped, matched: card.isMatched }"
          @click="flipCard(index)"
      >
        <div class="card-front">{{ card.emoji }}</div>
        <div class="card-back"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const emojis = ['😀', '😎', '🤩', '😍', '🤓', '😜', '😇', '🥳', '😱', '🤯', '🥶', '🤢', '🤠', '🥺', '🤡', '👻', '💩', '👽', '🤖', '🎃', '👾', '👐', '🙌', '👏', '🤝', '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐', '🖖', '👋', '🤙', '💪', '🦾', '🦿'];

const cards = ref([]);
const flippedCards = ref([]);
const isPaused = ref(true);
const gameTime = ref(0);
const timer = ref(null);

const remainingCards = computed(() => cards.value.filter(card => !card.isMatched).length);

const initializeGame = () => {
  const emojiPairs = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  cards.value = emojiPairs.map(emoji => ({
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
  flippedCards.value = [];
  gameTime.value = 0;
  isPaused.value = true;
};

const flipCard = (index) => {
  if (isPaused.value || cards.value[index].isMatched || cards.value[index].isFlipped) return;

  cards.value[index].isFlipped = true;
  flippedCards.value.push(index);

  if (flippedCards.value.length === 2) {
    const [firstIndex, secondIndex] = flippedCards.value;
    if (cards.value[firstIndex].emoji === cards.value[secondIndex].emoji) {
      cards.value[firstIndex].isMatched = true;
      cards.value[secondIndex].isMatched = true;
    } else {
      setTimeout(() => {
        cards.value[firstIndex].isFlipped = false;
        cards.value[secondIndex].isFlipped = false;
      }, 1000);
    }
    flippedCards.value = [];
  }
};

const togglePause = () => {
  isPaused.value = !isPaused.value;
  if (!isPaused.value) {
    startTimer();
  } else {
    clearInterval(timer.value);
  }
};

const restartGame = () => {
  clearInterval(timer.value);
  initializeGame();
};

const startTimer = () => {
  timer.value = setInterval(() => {
    gameTime.value++;
  }, 1000);
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

onMounted(() => {
  initializeGame();
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style lang="less" scoped>
.memory-card-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
}

.game-info {
  margin-bottom: 20px;
  font-size: 18px;
}

.game-controls {
  margin-bottom: 20px;
  button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
}

.game-board {
  display: grid;
  grid-template-columns: repeat(10, 50px);
  grid-template-rows: repeat(10, 50px);
  gap: 5px;
}

.card {
  position: relative;
  width: 50px;
  height: 50px;
  perspective: 1000px;
  cursor: pointer;

  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border-radius: 5px;
    transition: transform 0.6s;
  }

  .card-front {
    background-color: #fff;
    transform: rotateY(180deg);
  }

  .card-back {
    background-color: #ccc;
  }

  &.flipped .card-front {
    transform: rotateY(0deg);
  }

  &.flipped .card-back {
    transform: rotateY(180deg);
  }

  &.matched .card-front {
    background-color: #aaffaa;
  }
}
</style>
