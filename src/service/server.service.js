class ServerService {

    constructor(controller = null, pollingInterval = 5000) {
        this.controller = controller;
        this.pollingInterval = pollingInterval;
        this.pollingRequest = null;
    }

    startPollingGameState() {
        if (this.pollingRequest === null) {
            this.pollingRequest = setInterval(() => {
                this.fetchGameState();
            }, this.pollingInterval);
        }
    }

    stopPollingGameState() {
        if (this.pollingRequest !== null) {
            clearInterval(this.pollingRequest);
            this.pollingRequest = null;
        }
    }

    fetchGameState() {
        fetch('https://your-api-endpoint.com/gamestate')
            .then(response => response.json())
            .then(data => this.updateGameState(data))
            .catch(error => console.error('Failed to fetch game state:', error));
    }

    updateGameState(gameState) {
        // TODO: Convert game state into a match & player move
        this.controller.makeMove(match, move);
        console.log('Game State Updated:', gameState);
    }

    sendMove(matchId, move) {
        // Assume `matchId` identifies the current game/match and `move` is an object representing the move
        const url = `https://your-api-endpoint.com/matches/${matchId}/move`; // Adjust URL as needed
        fetch(url, {
            method: 'PUT', // or 'POST' if your API expects a POST request for this action
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(move)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Return match DTO
        })
        .then(data => {
            console.log('Move successfully sent', data);
        })
        .catch(error => {
            console.error('Error sending move:', error);
            return null;
        });
    }

}
