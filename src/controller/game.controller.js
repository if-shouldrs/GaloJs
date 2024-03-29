class GameController {
    constructor() {
        this.gameModel = new GameModel();
        this.gameService = new GameService();
        this.mainMenuLayer = new MainMenuLayer(this);
        this.gameLayer = null;
    }

    handlePlayerMove(match, move) {
    }

    startGame() {
        // Initialize or reset the game model
        this.gameModel.setupNewGame();

        // Create and display the game layer/scene
        this.gameLayer = new GameLayer(this);
        const gameScene = new cc.Scene();
        gameScene.addChild(this.gameLayer);
        cc.director.runScene(gameScene);
    }

    showMainMenu() {
        const menuScene = new cc.Scene();
        menuScene.addChild(this.mainMenuLayer);
        cc.director.runScene(menuScene);
    }
}
