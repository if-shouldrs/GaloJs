// TODO: Reimplement class, just a general example for now
class GameController {
    constructor() {
        this.gameModel = new GameModel();
        this.gameLayer = new GameLayer(this);
        this.setupGameScene();
    }

    setupGameScene() {
        const gameScene = new cc.Scene();
        gameScene.addChild(this.gameLayer);
    }

    openGameScene() {
        cc.director.runScene(gameScene);
    }

}
