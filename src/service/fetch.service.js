class FetchService {

    httpRequest(method, url, data = null) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(xhr.statusText || 'Request failed'));
                }
            };
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.send(JSON.stringify(data));
        });
    }

    fetch(url, options = {}) {
        if (window.fetch) {
            return window.fetch(url, options).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
        } else {
            // Fallback to XMLHttpRequest
            const method = options.method || 'GET';
            const data = options.body ? JSON.parse(options.body) : null;
            return this.httpRequest(method, url, data);
        }
    }

}
