class FetchService {

    httpRequest(method, url, data, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                callback(null, JSON.parse(xhr.responseText)); // First argument is error, second is data
            } else {
                callback(new Error(xhr.statusText || 'Request failed'));
            }
        };
        xhr.onerror = () => callback(new Error('Network error'));
        xhr.send(JSON.stringify(data));
    }

    fetch(url, options, callback) {
        // Check if fetch is available in the global scope
        if (typeof fetch === 'function') {
            fetch(url, options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => callback(null, data))
                .catch(error => callback(error));
        } else {
            // Fallback to XMLHttpRequest
            const method = options.method || 'GET';
            const data = options.body ? JSON.parse(options.body) : null;
            this.httpRequest(method, url, data, callback);
        }
    }

}
