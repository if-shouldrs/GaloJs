const { BOARD_SIZE_MULTIPLIER, LINE_THICKNESS, PIECE_FONT_SIZE, COLORS } = GAME_CONSTANTS;

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
        const backgroundColor = new cc.LayerColor(COLORS.BACKGROUND);
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
        const boardSize = Math.min(width, height) * BOARD_SIZE_MULTIPLIER;
        const cellSize = boardSize / 3;
        const startX = (width - boardSize) / 2;
        const startY = (height - boardSize) / 2;
        const lineThickness = LINE_THICKNESS;

        const drawNode = new cc.DrawNode();
        for (let i = 1; i <= 2; i++) {
            // Vertical lines
            drawNode.drawSegment(
                cc.p(startX + i * cellSize, startY),
                cc.p(startX + i * cellSize, startY + boardSize),
                lineThickness,
                COLORS.BOARD_LINES
            );
            // Horizontal lines
            drawNode.drawSegment(
                cc.p(startX, startY + i * cellSize),
                cc.p(startX + boardSize, startY + i * cellSize),
                lineThickness,
                COLORS.BOARD_LINES
            );
        }
        this.addChild(drawNode);
    },

    drawPiece(row, col, player) {
        const { width, height } = cc.winSize;
        const boardSize = Math.min(width, height) * BOARD_SIZE_MULTIPLIER;
        const cellSize = boardSize / 3;
        const startX = (width - boardSize) / 2 + cellSize / 2;
        const startY = (height - boardSize) / 2 + cellSize / 2;

        const piece = new cc.LabelTTF(player, "Arial", PIECE_FONT_SIZE);
        piece.setFontFillColor(COLORS.PIECE);
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
                this.handleTouchLocation(location);
                return true;
            },
        }, this);
    },

    handleTouchLocation(location) {
        const { row, col } = this.calculateBoardCoordinates(location);
        if (row !== null && col !== null) {
            const match = { boardState: this.board, status: 'in_progress', turn: this.player };
            const move = { player: this.player, row, col };
            this.controller.makeMove(match, move);
        }
    },

    calculateBoardCoordinates(location) {
        const { width, height } = cc.winSize;
        const boardSize = Math.min(width, height) * BOARD_SIZE_MULTIPLIER;
        const cellSize = boardSize / 3;
        const startX = (width - boardSize) / 2;
        const startY = (height - boardSize) / 2;

        const col = Math.floor((location.x - startX) / cellSize);
        const row = 2 - Math.floor((location.y - startY) / cellSize);

        if (row >= 0 && row < 3 && col >= 0 && col < 3) {
            return { row, col };
        } else {
            return { row: null, col: null };
        }
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
