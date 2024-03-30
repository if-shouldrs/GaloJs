const { BOARD_SIZE_MULTIPLIER, LINE_THICKNESS, PIECE_FONT_SIZE, COLORS } = GAME_CONSTANTS;

const GameLayer = cc.Layer.extend({
    player: 'X',
    statusLabel: null,

    ctor() {
        this._super();
        this.init();
    },

    init() {
        this.setBackgroundColour();
        this.setupStatusLabel();
    },

    setBackgroundColour() {
        const backgroundColor = new cc.LayerColor(COLORS.BACKGROUND);
        this.addChild(backgroundColor, -1);
    },

    setupStatusLabel() {
        const { width } = cc.winSize;
        const positionY = cc.winSize.height * 0.9;
        this.statusLabel = new cc.LabelTTF("", "Arial", 24);
        this.statusLabel.setFontFillColor(COLORS.TEXT);
        this.statusLabel.setPosition(width / 2, positionY);
        this.addChild(this.statusLabel, 2);
    },

    drawBoard() {
        // Check if the drawNode already exists, if not create it.
        if (!this.drawNode) {
            this.drawNode = new cc.DrawNode();
            this.addChild(this.drawNode);
        }

        this.drawNode.clear(); // Clear previous drawings if any

        const { width, height } = cc.winSize;
        const boardSize = Math.min(width, height) * BOARD_SIZE_MULTIPLIER;
        const cellSize = boardSize / 3;
        const startX = (width - boardSize) / 2;
        const startY = (height - boardSize) / 2;

        for (let i = 1; i <= 2; i++) {
            // Vertical lines
            this.drawNode.drawSegment(
                cc.p(startX + i * cellSize, startY),
                cc.p(startX + i * cellSize, startY + boardSize),
                LINE_THICKNESS,
                COLORS.BOARD_LINES
            );
            // Horizontal lines
            this.drawNode.drawSegment(
                cc.p(startX, startY + i * cellSize),
                cc.p(startX + boardSize, startY + i * cellSize),
                LINE_THICKNESS,
                COLORS.BOARD_LINES
            );
        }
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
    },

    registerMoveAction(makeMove) {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: (touch, _event) => {
                const location = touch.getLocation();
                // Convert the touch location to board coordinates
                const { row, col } = this.calculateBoardCoordinates(location);
                if (row !== null && col !== null) {
                    // Create a move object and pass it to the controller
                    const move = { player: this.player, row, col };
                    makeMove(move);
                }
                return true;
            },
        }, this);
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
        this.drawPiece(row, col, player);
        this.player = this.player === 'X' ? 'O' : 'X'; // TODO: Remove line, here for testing only
    },

    updateBoardFromState(board, turn) {
        board = board.split(',').map(row => row.split(''));
        board.forEach((row, i) => {
            row.forEach((player, j) => {
                if (player && player !== ' ') {
                    this.drawPiece(i, j, player);
                }
            });
        });
        this.player = turn; // TODO: Remove line, here for testing only
    },

    showWin(player) {
        this.statusLabel.setString(`${player} wins!`);
        cc.log(`${player} wins!`);
    },

    showTie() {
        this.statusLabel.setString(`It's a tie!`);
        cc.log(`It's a tie!`);
    },

});
