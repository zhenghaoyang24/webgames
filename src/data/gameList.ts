export const games = [
    {
        name: '扫雷',
        component: 'Minesweeper',
        loadComponent: () => import('@/components/games/Minesweeper.vue'),
        description: "一个简单的扫雷游戏。鼠标右键标记雷💣，双击查看周围区域。",
    },
    {
        name: '贪吃蛇',
        component: 'SnakeGame',
        loadComponent: () => import('@/components/games/SnakeGame.vue'),
        description: '一个简单的贪吃蛇游戏。通过键盘方向键（上下左右）控制方向。',
    },
    {
        name: '2048',
        component: 'Game2048',
        loadComponent: () => import('@/components/games/Game2048.vue'),
        description: '一个简单的2048游戏，通过键盘方向键（上下左右）移动数字，相同数字会合并并累加分数。',
    },
];
