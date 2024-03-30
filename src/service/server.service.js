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
        this.fetchService.fetch(url)
            .then(match => {
                console.log('Game State Updated:', match);
                this.controller.endMove(match);
            })
            .catch(error => console.error('Failed to fetch game state:', error));
    }

    createMatch() {
        const url = `${SERVER_URL}/matches`;
        this.fetchService.fetch(url, { method: 'POST' })
            .then(data => {
                console.log('Match created:', data);
                this.controller.endGameStart(data.match_id);
            })
            .catch(error => console.error('Failed to create match:', error));
    }

    sendMove(matchId, move) {
        const url = `${SERVER_URL}/matches/${matchId}/move`;
        this.fetchService.fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(move)
        })
        .then(match => {
            console.log('Move successfully sent', match);
            this.controller.endMove(match);
        })
        .catch(error => {
            console.error('Error sending move:', error);
        });
    }

}
