# webgames

[中文](https://github.com/zhenghaoyang24/filetree/blob/master/README.md) | English

🎮 **webgames** is a web application containing multiple mini-games that you can play right away! All games are developed based on Vue 3, with clean and extensible code. Welcome to experience and contribute!

---

## Project Preview

Play online: [vue-webgames](https://vue-webgames.netlify.app/)

---

## Supported Games

1. **Snake**  
   Control the snake to eat food and avoid hitting walls or its own body.
2. **2048**  
   Merge number tiles to reach 2048.
3. **Minesweeper**  
   The classic Minesweeper game, testing your logical reasoning skills.

---

## Tech Stack

- **Frontend Framework**: Vue 3
- **Language**: TypeScript
- **Build Tool**: Vite

---

## Contribution Guide

If you have any ideas, feel free to open an `issue` or submit a `PR`. If you want to add a new game, please follow these steps:

1. Create a new game component under the [src/components/games/](https://github.com/zhenghaoyang24/webgames/tree/master/src/components/games) directory (this component should contain all the game logic), for example, `Game.vue`.
2. Add the new game information in [src/data/gameList.ts](https://github.com/zhenghaoyang24/webgames/blob/master/src/data/gameList.ts):

   ```typescript
   {
     name: 'Game Name',
     component: 'Component Name',
     description: 'Game Description',
     loadComponent: () => import('@/components/games/Game.vue'),
   }
   ```

3. The game will automatically appear in the game list and can be played directly by clicking on it.

---

## License

This project is open-sourced under the [MIT License](https://github.com/zhenghaoyang24/webgames?tab=MIT-1-ov-file).

---

Thank you for your attention and support! Hope you enjoy this mini-game collection! 🎉
