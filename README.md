# webgames

🎮 **webgames** 是一个包含多个小游戏的网页应用，打开即可游玩！。所有游戏均基于 Vue 3 开发，代码简洁易扩展，欢迎体验和贡献！

---

## 项目预览

在线游玩：[vue-webgames](https://vue-webgames.netlify.app/)  

---

## 已支持的游戏

1. **贪吃蛇**  
   控制蛇吃食物，避免撞到墙壁或自己的身体。
2. **2048**  
   通过合并数字方块，最终达到 2048。
3. **扫雷**  
   经典的扫雷游戏，考验你的逻辑推理能力。
---

## 技术栈

- **前端框架**: Vue 3
- **语言**: TypeScript
- **构建工具**: Vite

---

## 贡献指南

若你有任何想法，欢迎提 `issue` 或 `PR`。若你想添加新游戏，请按照以下步骤操作：  

1. 在 [src/components/games/](https://github.com/zhenghaoyang24/webgames/tree/master/src/components/games) 目录下创建一个新的游戏组件（这个组件包含游戏的所有内容），例如 `Game.vue`。
2. 在 [src/data/gameList.ts](https://github.com/zhenghaoyang24/webgames/blob/master/src/data/gameList.ts) 中添加新游戏的信息：

   ```typescript
   {
     name: '游戏名',
     component: '组件名',
     description: '游戏描述',
     loadComponent: () => import('@/components/games/Game.vue'),
   }
   ```

3. 至此，游戏内容会自动出现在游戏列表中，可以直接点击游玩。

---


## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

---

感谢你的关注和支持！希望你喜欢这个小游戏合集！🎉
