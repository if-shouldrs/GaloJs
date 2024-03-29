class GameController {
    constructor() {
        this.gameModel = new GameModel();
        this.gameService = new GameService();
        this.mainMenuLayer = new MainMenuLayer(this);
        this.gameLayer = null;
    }

    makeMove(match, move) {
        // Check if the move is valid
        const isValid = this.gameService.isValidMove(match, move);
        if (isValid) {
            const moveApplied = this.gameService.applyMove(match, move);

            if (!moveApplied) {
                // Server said our move is invalid
                return;
            }

            // Update the game layer to reflect the move
            this.gameLayer.updateBoard(move.row, move.col, move.player);

            const win = this.gameService.isWin(match, move);
            const tie = this.gameService.isTie(match.boardState);

            if (win) {
                this.gameLayer.showWin(move.player);
            } else if (tie) {
                this.gameLayer.showTie();
            } else {
                // Re-enable polling TODO: Polling should be on only whe it's not the player's turn
            }
        }
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
