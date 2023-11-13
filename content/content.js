// https://developer.chrome.com/apps/runtime#event-onMessage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    (async () => {
        if (message.info === 'add checkbox') {
            const checkbox = document.createElement('input');
            checkbox.id = 'read-later-checkbox';
            checkbox.type = 'checkbox';
            checkbox.style.position = 'fixed';
            checkbox.style.top = '10px';
            checkbox.style.right = '10px';
            document.body.appendChild(checkbox);
            checkbox.addEventListener('change', function () {
                chrome.storage.sync.get(null, function (data) {
                    const matchedData = data[message._url]
                    matchedData.state = true
                    const newData = {[message._url]: matchedData}
                    chrome.storage.local.set(newData);
                    chrome.storage.sync.remove(message._url);
                });
                sendResponse('read over')
            });
        }
    })()

    // Return true in onMessage will wait the async function.
    return true
})
