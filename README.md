# webgames

中文 | [English](https://github.com/zhenghaoyang24/webgames/blob/master/README_EN.md)


🎮 **webgames** 是一个包含多个小游戏的网页应用，打开即可游玩！。所有游戏均基于 Vue 3 开发，代码简洁易扩展，欢迎体验和贡献！


## 项目预览

在线游玩：[vue-webgames](https://vue-webgames.netlify.app/)  


## 已支持的游戏

1. **贪吃蛇**  
   控制蛇吃食物，避免撞到墙壁或自己的身体。
   
   <img style="width:150px;" src="https://github.com/user-attachments/assets/7ae2694c-c06b-40d8-bbed-6443fbf9fb5b" />

2. **2048**  
   通过合并数字方块，最终达到 2048。

   <img style="width:150px;" src="https://github.com/user-attachments/assets/9ba881f8-0c9d-4052-b066-023b03373bc3" />

3. **扫雷**  
   经典的扫雷游戏，考验你的逻辑推理能力。
   
   <img style="width:150px;" src="https://github.com/user-attachments/assets/59370bda-bd95-4c6a-8f9f-2fa56735c8a7" />
   
4. **数独**  
   一个简单的数独游戏，填入正确的数字吧。

   <img style="width:150px;" src="https://github.com/user-attachments/assets/3ab1b7d9-3bd6-4c0d-a1f0-621652572515" />

5. **记忆卡片**  
   点击方格，匹配所有的 emoji ！

   <img style="width:150px;" src="https://github.com/user-attachments/assets/a4a49ace-b1b2-4836-9e7c-7fe478b62087" />

6. **迷宫**  
   一个迷宫，不难也不简单！

   <img style="width:150px;" src="https://github.com/user-attachments/assets/000a3f26-cb23-4308-9da5-852328e029e4" />



## 技术栈

- **前端框架**: Vue 3
- **语言**: TypeScript
- **构建工具**: Vite


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


## 许可证

本项目基于 [MIT 许可证](https://github.com/zhenghaoyang24/webgames?tab=MIT-1-ov-file) 开源。

---

感谢你的关注和支持！希望你喜欢这个小游戏合集！🎉
