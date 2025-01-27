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
        description: '一个简单的贪吃蛇游戏。通过键盘方向键（上下左右）控制方向。小心！碰到墙壁会死亡！',
    },
    {
        name: '2048',
        component: 'Game2048',
        loadComponent: () => import('@/components/games/Game2048.vue'),
        description: '一个简单的2048游戏，通过键盘方向键（上下左右）移动数字，相同数字会合并并累加分数。',
    },
    {
        name: '数独',
        component: 'SudokuGame',
        loadComponent: () => import('@/components/games/SudokuGame.vue'),
        description: '一个简单的数独游戏，填入 1 - 9 之间的数字，保证每行每列不重复。',
    },
    {
        name: '记忆卡片',
        component: 'MemoryCardGame',
        loadComponent: () => import('@/components/games/MemoryCardGame.vue'),
        description: '记忆卡片游戏，点击方格匹配所有 emoji ！',
    },
    {
        name: '迷宫',
        component: 'MazeGame',
        loadComponent: () => import('@/components/games/MazeGame.vue'),
        description: '一个迷宫游戏，不难也不简单！使用键盘方向键移动。',
    },
    {
        name: '测试游戏',
        component: 'GameTest',
        loadComponent: () => import('@/components/games/GameTest.vue'),
        description: '开发中的游戏。',
    },
];
