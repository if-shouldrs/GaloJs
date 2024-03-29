const GameLayer = cc.Layer.extend({
    controller: null,
    player: 'X',
    board: [],

    ctor(controller) {
        this._super();
        this.controller = controller;
        this.init();
    },

    init() {
        this.initBoard();
        this.setupTouchHandling();
        this.setBackgroundColour();
        this.drawBoard();
    },

    setBackgroundColour() {
        const backgroundColor = new cc.LayerColor(cc.color(255, 255, 255, 255));
        this.addChild(backgroundColor, -1);
    },

    initBoard() {
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ];
    },

    drawBoard() {
        const { width, height } = cc.winSize;
        const boardSize = Math.min(width, height) * 0.8;
        const cellSize = boardSize / 3;
        const startX = (width - boardSize) / 2;
        const startY = (height - boardSize) / 2;
        const lineThickness = 4;

        const drawNode = new cc.DrawNode();
        for (let i = 1; i <= 2; i++) {
            // Vertical lines
            drawNode.drawSegment(
                cc.p(startX + i * cellSize, startY),
                cc.p(startX + i * cellSize, startY + boardSize),
                lineThickness,
                cc.color(0, 0, 0, 255)
            );
            // Horizontal lines
            drawNode.drawSegment(
                cc.p(startX, startY + i * cellSize),
                cc.p(startX + boardSize, startY + i * cellSize),
                lineThickness,
                cc.color(0, 0, 0, 255)
            );
        }
        this.addChild(drawNode);
    },

    drawPiece(row, col, player) {
        const { width, height } = cc.winSize;
        const boardSize = Math.min(width, height) * 0.8;
        const cellSize = boardSize / 3;
        const startX = (width - boardSize) / 2 + cellSize / 2;
        const startY = (height - boardSize) / 2 + cellSize / 2;

        const piece = new cc.LabelTTF(player, "Arial", 96);
        piece.setFontFillColor(cc.color(0, 0, 0));
        piece.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        piece.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        piece.setPosition(startX + col * cellSize, startY + (2 - row) * cellSize);
        this.addChild(piece, 1);
        this.player = this.player === 'X' ? 'O' : 'X'; // TODO: Remove line, here for testing only
    },

    setupTouchHandling() {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: (touch, event) => {
                const location = touch.getLocation();
                this.processTouch(location);
                return true;
            },
        }, this);
    },

    // Converts the touch location to a row and column on the board, then makes a call to the controller to make the move
    processTouch(location) {
        const { width, height } = cc.winSize;
        const boardSize = Math.min(width, height) * 0.8;
        const cellSize = boardSize / 3;
        const startX = (width - boardSize) / 2;
        const startY = (height - boardSize) / 2;

        const col = Math.floor((location.x - startX) / cellSize);
        const row = 2 - Math.floor((location.y - startY) / cellSize);

        const match = { boardState: this.board, status: 'in_progress', turn: this.player};
        const move = { player: this.player , row, col };
        this.controller.makeMove(match, move);
    },

    updateBoard(row, col, player) {
        this.board[row][col] = player;
        this.drawPiece(row, col, player);
    },

    showWin(player) {
        cc.log(`${player} wins!`);
        // TODO: Additional UI logic for win scenario
    },

    showTie() {
        cc.log(`It's a tie!`);
        // TODO: Additional UI logic for tie scenario
    },

});
