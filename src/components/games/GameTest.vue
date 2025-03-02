<template>
  <div class="game-container">
    <div v-if="!isPlaying" class="game-intro">
      <h2>反应力训练游戏</h2>
      <p>点击屏幕生成小球，准确点击蓝色小球得分！</p>
    </div>

    <div class="game-controls">
      <button @click="handleControlClick">
        {{ isPlaying ? (isPaused ? '继续' : '暂停') : (timeLeft === 0 ? '再来一局' : '开始游戏') }}
      </button>
      <div v-if="isPlaying" class="game-stats">
        剩余时间：{{ timeLeft }}秒
      </div>
    </div>

    <div v-if="timeLeft === 0 && !isPlaying" class="final-stats">
      <h3>游戏结果：</h3>
      <p>命中数：{{ hitCount }}</p>
      <p>失误数：{{ missCount }}</p>
      <p>命中率：{{ hitRate }}%</p>
    </div>

    <div
        v-if="isPlaying"
        ref="gameAreaRef"
        class="game-area"
        @click="handleGameAreaClick"
    >
      <div
          v-for="ball in balls"
          :key="ball.id"
          class="ball"
          :class="{ 'hit': ball.status === 'hit', 'miss': ball.status === 'miss' }"
          :style="ballStyle(ball)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

type BallStatus = 'normal' | 'hit' | 'miss';

interface GameBall {
  id: number;
  x: number;
  y: number;
  size: number;
  status: BallStatus;
}

const isPlaying = ref(false);
const isPaused = ref(false);
const timeLeft = ref(60);
const balls = ref<GameBall[]>([]);
const hitCount = ref(0);
const missCount = ref(0);
const gameAreaRef = ref<HTMLElement | null>(null);
let gameTimer: number | null = null;

const hitRate = computed(() => {
  const total = hitCount.value + missCount.value;
  return total > 0 ? ((hitCount.value / total) * 100).toFixed(1) : 0;
});

const ballStyle = (ball: GameBall) => ({
  left: `${ball.x}px`,
  top: `${ball.y}px`,
  width: `${ball.size}px`,
  height: `${ball.size}px`,
});

const createNewBall = () => {
  if (!gameAreaRef.value) return;

  const size = Math.floor(Math.random() * 30 + 40); // 40-70px
  const maxX = gameAreaRef.value.clientWidth - size;
  const maxY = gameAreaRef.value.clientHeight - size;

  const newBall: GameBall = {
    id: Date.now(),
    x: Math.max(0, Math.floor(Math.random() * maxX)),
    y: Math.max(0, Math.floor(Math.random() * maxY)),
    size,
    status: 'normal',
  };

  balls.value.push(newBall);
};

const handleGameAreaClick = (event: MouseEvent) => {
  if (!isPlaying.value || isPaused.value) return;

  const rect = gameAreaRef.value?.getBoundingClientRect();
  if (!rect) return;

  // 计算点击位置
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  // 检查是否命中任何小球
  let hitBall = false;
  const updatedBalls = balls.value.map(ball => {
    const isHit =
        clickX >= ball.x &&
        clickX <= ball.x + ball.size &&
        clickY >= ball.y &&
        clickY <= ball.y + ball.size;

    if (isHit && ball.status === 'normal') {
      hitBall = true;
      hitCount.value++;
      return { ...ball, status: 'hit' };
    }
    return ball;
  });

  // 如果没有命中任何小球
  if (!hitBall) {
    missCount.value++;
    // 找到最后一个正常状态的小球标记为miss
    const lastNormalBall = updatedBalls.find(b => b.status === 'normal');
    if (lastNormalBall) {
      updatedBalls.forEach(b => {
        if (b.id === lastNormalBall.id) {
          b.status = 'miss';
        }
      });
    }
  }

  // 更新小球状态并添加新球
  balls.value = updatedBalls;
  createNewBall();

  // 自动移除已标记的小球
  setTimeout(() => {
    balls.value = balls.value.filter(b => b.status === 'normal');
  }, 200);
};

const handleControlClick = () => {
  if (isPlaying.value) {
    if (isPaused.value) {
      // 继续游戏
      isPaused.value = false;
      startTimer();
    } else {
      // 暂停游戏
      isPaused.value = true;
      if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
      }
    }
  } else {
    // 开始新游戏
    resetGame();
    isPlaying.value = true;
    isPaused.value = false;
    startTimer();
    createNewBall();
  }
};

const startTimer = () => {
  gameTimer = setInterval(() => {
    if (!isPaused.value) {
      timeLeft.value--;
      if (timeLeft.value <= 0) {
        endGame();
      }
    }
  }, 1000);
};

const resetGame = () => {
  timeLeft.value = 60;
  hitCount.value = 0;
  missCount.value = 0;
  balls.value = [];
};

const endGame = () => {
  isPlaying.value = false;
  isPaused.value = false;
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
};

onUnmounted(() => {
  if (gameTimer) {
    clearInterval(gameTimer);
  }
});
</script>

<style scoped>
.game-container {
  text-align: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.game-intro {
  margin-bottom: 20px;
}

.game-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

button {
  padding: 10px 30px;
  font-size: 16px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover {
  background: #1976D2;
}

.game-stats {
  font-size: 16px;
  color: #666;
}

.game-area {
  position: relative;
  width: 100%;
  height: 500px;
  border: 2px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background: #f8f8f8;
}

.ball {
  position: absolute;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  background: #2196F3;
  transform: translate(-50%, -50%);
}

.ball.hit {
  background: #4CAF50 !important;
  transform: translate(-50%, -50%) scale(1.2);
}

.ball.miss {
  background: #f44336 !important;
  transform: translate(-50%, -50%) scale(0.8);
}

.final-stats {
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.final-stats h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.final-stats p {
  margin: 8px 0;
  font-size: 16px;
  color: #666;
}
</style>
