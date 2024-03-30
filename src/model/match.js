class Match {
    constructor(board = "   ,   ,   ", status = "RUNNING", turn = "X") {
        this.board = board;
        this.status = status; // RUNNING, PLAYER1WON, PLAYER2WON, TIE
        this.turn = turn;
    }
}
