class GameModel {
    constructor() {
        this.player = 'X';
        this.match = new Match();
        this.id = null;
    }

    updateBoard(row, col, player) {
        if (this.match.status !== 'RUNNING') {
            return;
        }
        if (player !== this.match.turn) {
            return;
        }

        const board = this.match.board;
        const position = (row * 4) + col;
        if (board.charAt(position) !== ' ') {
            return;
        }

        this.match.board = board.substring(0, position) + player + board.substring(position + 1);
        this.match.turn = player === 'X' ? 'O' : 'X';
    }

    updateBoard(board, player = null) {
        this.match.board = board;
        if (player !== null) {
            this.match.turn = player;
        }
    }

    setupGame(matchId, match = null) {
        this.match = match ?? new Match();
        this.player = this.match.turn;
        this.id = matchId;
    }

    isValidMove(match, move) {
        // TODO: Replace this stub with actual implementation
        return true;
    }

}
