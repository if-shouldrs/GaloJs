class ServerService {

    constructor(updateMatch, pollingInterval = 1000) {
        this.updateMatch = updateMatch;
        this.fetchService = new FetchService();
        this.pollingInterval = pollingInterval;
        this.pollingRequest = null;
    }

    startPolling(matchId) {
        if (this.pollingRequest === null) {
            this.pollingRequest = setInterval(() => {
                this.fetchGameState(matchId);
            }, this.pollingInterval);
        }
    }

    stopPolling() {
        if (this.pollingRequest !== null) {
            clearInterval(this.pollingRequest);
            this.pollingRequest = null;
        }
    }

    fetchGameState(matchId, update = this.updateMatch) {
        const url = `${SERVER_URL}/matches/${matchId}`;
        this.fetchService.fetch(url, {}, (error, match) => {
            if (error) {
                console.error('Failed to fetch game state:', error);
            } else {
                console.log('Game State Updated:', match);
                update(match);
            }
        });
    }

    getMatchList(showMatches) {
        const url = `${SERVER_URL}/matches`;
        this.fetchService.fetch(url, {}, (error, data) => {
            if (error) {
                console.error('Failed to fetch match list:', error);
            } else {
                console.log('Match list:', data);
                showMatches(data);
            }
        });
    }

    createMatch(startGame) {
        const url = `${SERVER_URL}/matches`;
        this.fetchService.fetch(url, { method: 'POST' }, (error, data) => {
            if (error) {
                console.error('Failed to create match:', error);
            } else {
                console.log('Match created:', data);
                startGame(data.match_id);
            }
        });
    }

    joinMatch(matchId, joinGame) {
        this.fetchGameState(matchId, joinGame);
    }

    sendMove(matchId, move, processMove) {
        const url = `${SERVER_URL}/matches/${matchId}/move`;
        this.fetchService.fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(move)
        }, (error, match) => {
            if (error) {
                console.error('Error sending move:', error);
                processMove(null);
            } else {
                console.log('Move successfully sent', match);
                processMove(match);
            }
        });
    }

}
