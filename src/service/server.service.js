class ServerService {

    constructor(controller = null, pollingInterval = 5000) {
        this.controller = controller;
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

    fetchGameState(matchId) {
        const url = `${SERVER_URL}/matches/${matchId}`;
        this.fetchService.fetch(url, {}, (error, match) => {
            if (error) {
                console.error('Failed to fetch game state:', error);
            } else {
                console.log('Game State Updated:', match);
                this.controller.endMove(match);
            }
        });
    }

    createMatch() {
        const url = `${SERVER_URL}/matches`;
        this.fetchService.fetch(url, { method: 'POST' }, (error, data) => {
            if (error) {
                console.error('Failed to create match:', error);
            } else {
                console.log('Match created:', data);
                this.controller.endGameStart(data.match_id);
            }
        });
    }

    sendMove(matchId, move) {
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
            } else {
                console.log('Move successfully sent', match);
                this.controller.endMove(match);
            }
        });
    }

}
