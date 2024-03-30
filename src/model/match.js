class Match {
    constructor(boardstate = "   ,   ,   ", status = "RUNNING", turn = "X") {
        this.boardState = boardstate;
        this.status = status; // RUNNING, PLAYER1WON, PLAYER2WON, TIE
        this.turn = turn;
    }
}
