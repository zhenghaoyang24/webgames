<template>
  <div class="container">
    <!-- 动态背景元素 -->
    <canvas ref="canvas" class="background-canvas"></canvas>

    <!-- 标题和引导文字 -->
    <div class="hero-section">
      <div class="title-group">
        <LogoIcon/>
        <h1 class="main-title">webgames</h1>
      </div>
      <p class="guide-text">快从左上角选择一个游戏开始吧！</p>
    </div>

    <!-- 特征卡片网格 -->
    <div class="card-grid">
      <div
          v-for="(card, index) in featureCards"
          :key="card.title"
          class="feature-card"
          :style="{ '--delay': index * 0.1 + 's' }"
      >
        <div class="card-content">
          <Icon
              :icon="card.icon"
              class="card-icon"
              :style="{ color: card.color }"
          />
          <h3
              class="card-title"
              :style="{ color: card.color }"
          >{{ card.title }}</h3>
          <p class="card-desc">{{ card.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onUnmounted } from 'vue'
import LogoIcon from "@/components/icon/LogoIcon.vue";

// 画布粒子系统
const canvas = ref(null)
const gameNames = ref([
  '扫雷', '贪吃蛇', '2048', '数独', '记忆卡片', '迷宫',
  '拼字', '跑酷', '猜单词', '纸牌', '连连看', '推箱子',
  '五子棋', '黑白棋', '华容道', '数独', '24点', '翻牌'
])

// 特征卡片配置
const featureCards = ref([
  { title: '策略', color: '#2E86C1', icon: 'mdi:chess-knight', description: '精心布局才能赢得胜利' },
  { title: '益智', color: '#E67E22', icon: 'ph:puzzle-piece', description: '激活你的大脑潜能' },
  { title: '休闲', color: '#27AE60', icon: 'ion:game-controller', description: '轻松愉快的游戏体验' },
  { title: '解压', color: '#9B59B6', icon: 'mdi:flower', description: '释放压力的最佳方式' },
])

// 粒子系统配置
class FloatingText {
  constructor(ctx, text, colors) {
    this.ctx = ctx
    this.text = text
    this.color = colors[Math.floor(Math.random() * colors.length)]
    this.reset()
  }

  reset() {
    this.x = Math.random() * this.ctx.canvas.width
    this.y = Math.random() * this.ctx.canvas.height
    this.vx = (Math.random() - 0.5) * 2
    this.vy = (Math.random() - 0.5) * 2
    this.size = Math.random() * 24 + 24
    this.alpha = Math.random() * 0.3 + 0.7
  }

  update() {
    this.x += this.vx
    this.y += this.vy

    if (this.x < 0 || this.x > this.ctx.canvas.width) this.vx *= -1
    if (this.y < 0 || this.y > this.ctx.canvas.height) this.vy *= -1
  }

  draw() {
    this.ctx.save()
    this.ctx.font = `${this.size}px Arial Black`
    this.ctx.fillStyle = this.color.replace(/[^,]+(?=\))/, this.alpha)
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText(this.text, this.x, this.y)
    this.ctx.restore()
  }
}

// 画布初始化
let particles = []
const colors = [
  'rgba(255,107,107,ALPHA)',   // 红色系
  'rgba(78,205,196,ALPHA)',    // 青色系
  'rgba(255,167,38,ALPHA)',    // 橙色系
  'rgba(155,89,182,ALPHA)',    // 紫色系
  'rgba(52,152,219,ALPHA)',    // 蓝色系
  'rgba(46,204,113,ALPHA)'     // 绿色系
]

onMounted(() => {
  const ctx = canvas.value.getContext('2d')

  // 初始化画布
  const resize = () => {
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
  }
  window.addEventListener('resize', resize)
  resize()

  // 创建粒子
  particles = gameNames.value.flatMap(name =>
      Array.from({ length: 3 }, () => new FloatingText(ctx, name, colors))
  )

  // 动画循环
  let animationFrame
  const animate = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    particles.forEach(p => {
      p.update()
      p.draw()
    })
    animationFrame = requestAnimationFrame(animate)
  }
  animate()

  onUnmounted(() => {
    window.removeEventListener('resize', resize)
    cancelAnimationFrame(animationFrame)
  })
})
</script>

<style scoped>
.container {
  position: relative;
  min-height: calc( 100vh - 60px);
}

.background-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
  pointer-events: none;
}

.hero-section {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  text-align: center;
  width: 100%;
}

.title-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.8rem;
  color: rgba(24, 24, 24, 0.9);
  svg{
    width: 45px;
    height: 45px;
  }
}

.main-title {
  font-size: 3rem;
  color: rgba(24, 24, 24, 0.9);
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
  margin: 0;
  letter-spacing: 2px;
}

.guide-text {
  display: inline-flex;
  padding: 3px;
  background-color: rgba(255, 255, 255, 0.66);
  font-size: 1.2rem;
  color: rgba(44, 44, 44, 0.8);
  text-shadow: 0 1px 4px rgba(0,0,0,0.2);
  margin: 0;
  font-weight: 600;
}

.card-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
  top: 30%;
  padding: 0 30px 30px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: cardEntrance 0.6s ease-out both;
  backdrop-filter: blur(5px);
}

.feature-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.card-content {
  text-align: center;
}

.card-icon {
  width: 3.5rem;
  height: 3.5rem;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.feature-card:hover .card-icon {
  transform: rotate(15deg) scale(1.1);
}

.card-title {
  font-size: 1.5rem;
  margin-bottom: 0.8rem;
  transition: color 0.3s ease;
}

.card-desc {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    top: 10%;
  }

  .main-title {
    font-size: 2rem;
  }

  .guide-text {
    font-size: 1rem;
  }

  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
