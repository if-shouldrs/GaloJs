class GameModel {
    constructor() {
        this.match = new Match();
    }

    updateBoard(row, col, player) {
        if (this.match.status !== 'RUNNING') {
            return;
        }
        if (player !== this.match.turn) {
            return;
        }
        if (this.board[row][col] !== '') {
            return;
        }
        const position = (row * 4) + col;
        this.match.boardState = this.match.boardState.substring(0, position) + player + this.match.boardState.substring(position + 1);
        this.match.turn = player === 'X' ? 'O' : 'X';
    }

    updateBoard(boardState) {
        this.board = boardState.split(',').map(row => row.split(''));
    }

    setupNewGame() {
        this.match = new Match();
    }

}
