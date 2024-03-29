class SceneManager {
    static goToMainMenu() {
        const scene = new MainMenuScene();
        cc.director.runScene(scene);
    }

    static goToGame() {
        const scene = new GameScene();
        cc.director.runScene(scene);
    }
}
