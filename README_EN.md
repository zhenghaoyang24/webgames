# webgames

[中文](https://github.com/zhenghaoyang24/webgames/blob/master/README.md) | English

🎮 **webgames** is a web application containing multiple mini-games that you can play right away! All games are developed based on Vue 3, with clean and extensible code. Welcome to experience and contribute!


## Project Preview

Play online: [vue-webgames](https://vue-webgames.netlify.app/)

## Supported Games

1. **Snake**  
   Control the snake to eat food and avoid hitting walls or its own body.
   
   <img style="width:150px;" src="https://github.com/user-attachments/assets/7ae2694c-c06b-40d8-bbed-6443fbf9fb5b" />
   
2. **2048**  
   Merge number tiles to reach 2048.

   <img style="width:150px;" src="https://github.com/user-attachments/assets/9ba881f8-0c9d-4052-b066-023b03373bc3" />
   
3. **Minesweeper**  
   The classic Minesweeper game, testing your logical reasoning skills.

   <img style="width:150px;" src="https://github.com/user-attachments/assets/59370bda-bd95-4c6a-8f9f-2fa56735c8a7" />
   
4. **Sudoku**  
   A simple Sudoku game, fill in the correct numbers.

   <img style="width:150px;" src="https://github.com/user-attachments/assets/3ab1b7d9-3bd6-4c0d-a1f0-621652572515" />
   
5. **Memory Cards**  
   Click on the squares to match all the emojis!

   <img style="width:150px;" src="https://github.com/user-attachments/assets/a4a49ace-b1b2-4836-9e7c-7fe478b62087" />

6. **Maze**  
   A maze that's not too easy, not too difficult!

   <img style="width:150px;" src="https://github.com/user-attachments/assets/000a3f26-cb23-4308-9da5-852328e029e4" />




## Tech Stack

- **Frontend Framework**: Vue 3
- **Language**: TypeScript
- **Build Tool**: Vite


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


## License

This project is open-sourced under the [MIT License](https://github.com/zhenghaoyang24/webgames?tab=MIT-1-ov-file).

---

Thank you for your attention and support! Hope you enjoy this mini-game collection! 🎉
