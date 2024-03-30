class ServerService {

    constructor(controller = null, pollingInterval = 5000) {
        this.controller = controller;
        this.pollingInterval = pollingInterval;
        this.pollingRequest = null;
    }

    startPollingGameState(matchId) {
        if (this.pollingRequest === null) {
            this.pollingRequest = setInterval(() => {
                this.fetchGameState(matchId);
            }, this.pollingInterval);
        }
    }

    stopPollingGameState() {
        if (this.pollingRequest !== null) {
            clearInterval(this.pollingRequest);
            this.pollingRequest = null;
        }
    }

    fetchGameState(matchId) {
        const url = `${SERVER_URL}/matches/${matchId}`;
        fetch(url)
            .then(response => response.json())
            .then(match => this.updateGameState(match))
            .catch(error => console.error('Failed to fetch game state:', error));
    }

    updateGameState(match) {
        this.controller.processUpdate(match);
        console.log('Game State Updated:', match);
    }

    createMatch() {
        const url = `${SERVER_URL}/matches`;
        fetch(url, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                console.log('Match created:', data);
                this.controller.endGameStart(data.match_id);
            })
            .catch(error => console.error('Failed to create match:', error));
    }

    sendMove(matchId, move) {
        const url = `${SERVER_URL}/matches/${matchId}/move`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(move)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
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
