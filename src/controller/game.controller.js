class GameController {
    constructor() {
        this.game = new GameModel();
        this.serverService = new ServerService();
        this.mainMenuLayer = new MainMenuLayer(this.beginGameStart.bind(this));
        this.gameLayer = null;
    }

    load() {
        this.showMainMenu();
    }

    beginMove(move) {
        const match = this.game.match;
        // Check if the move is valid
        const isValid = this.game.isValidMove(match, move);
        if (isValid) {
            this.serverService.sendMove(this.game.id, move, this.processMove.bind(this));
        }
    }

    processMove(match) {
        if (match === null) {
            // Server said our move is invalid
            return;
        }

        this.game.updateBoard(match.board, match.turn);
        this.gameLayer.updateBoardFromState(this.game.match.board, this.game.match.turn);
        if (match.status === 'RUNNING') {
            if (match.turn === this.game.match.turn) {
                this.serverService.stopPolling();
            } else {
                this.serverService.startPolling(this.game.id);
            }
        } else {
            this.serverService.stopPolling();

            if (match.status === 'TIE') {
                this.gameLayer.showTie();
            } else {
                this.gameLayer.showWin(match.status === 'PLAYER1WON' ? 'X' : 'O');
            }
        }
    }

    beginGameStart() {
        const id = this.serverService.createMatch(this.processGameStart.bind(this));
    }

    processGameStart(id) {
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
