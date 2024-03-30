class GameController {
    constructor() {
        this.game = new GameModel();
        this.serverService = new ServerService(this.processMove.bind(this));
        this.mainMenuLayer = new MainMenuLayer(this.startGame.bind(this));
        this.gameLayer = null;
    }

    load() {
        this.showMainMenu();
    }

    makeMove(move) {
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

    startGame() {
        this.serverService.createMatch(this.processGame.bind(this));
    }

    joinGame(id) {
        this.serverService.joinMatch(id, match => {
            this.processGame(id);
            this.processMove(match);
        });
    }

    processGame(id) {
        if (isNaN(id)) {
            console.error('Failed to process match');
            return;
        }

        this.game.setupGame(id);

        // Prepare the game layer
        this.gameLayer = new GameLayer();
        this.gameLayer.registerMoveAction(this.makeMove.bind(this));
        this.gameLayer.drawBoard();
        // Setup & run the game scene
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
