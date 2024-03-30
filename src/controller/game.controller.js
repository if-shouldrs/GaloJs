class GameController {
    constructor() {
        this.game = new GameModel();
        this.gameService = new GameService();
        this.serverService = new ServerService(this);
        this.mainMenuLayer = new MainMenuLayer(this);
        this.gameLayer = null;
    }

    processUpdate(match) {
        const game = this.game;
        game.updateBoard(match.board, match.turn);
        this.gameLayer.updateBoardFromState(game.match.board, game.match.turn);
        if (match.status === 'RUNNING') {
            if (match.turn === game.match.turn) {
                // Disable polling
                this.serverService.stopPollingGameState();
            } else {
                // Re-enable polling
                this.serverService.startPollingGameState(game.id);
            }
        } else {
            // Stop polling
            this.serverService.stopPollingGameState();

            if (match.status === 'TIE') {
                this.gameLayer.showTie();
            } else {
                this.gameLayer.showWin(match.status === 'PLAYER1WON' ? 'X' : 'O');
            }
        }
    }

    beginMove(move) {
        const match = this.game.match;
        // Check if the move is valid
        const isValid = this.gameService.isValidMove(match, move);
        if (isValid) {
           this.serverService.sendMove(this.game.id, move);
        }
    }

    endMove(match) {
        if (match === null) {
            // Server said our move is invalid
            return;
        }
        // Update the game state & UI
        this.processUpdate(match);
    }

    beginGameStart() {
        const id = this.serverService.createMatch();
    }

    endGameStart(id) {
        if (isNaN(id)) {
            console.error('Failed to create match');
            return;
        }

        this.game.setupNewGame(id);

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
