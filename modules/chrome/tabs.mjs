// https://developer.chrome.com/extensions/tabs#method-query
export function query (info) {
    return new Promise(resolve => chrome.tabs.query(info, resolve))
}

export async function queryAll () {
    return await query({})
}

export async function queryCurrent () {
    const info = {
        active:        true,
        currentWindow: true,
    }
    const tabs = await query(info)
    return tabs[0]
}

// https://developer.chrome.com/extensions/tabs#method-remove
export function remove (tab) {
    chrome.tabs.remove(tab.id)
}

// https://developer.chrome.com/extensions/tabs#method-create
export function create (url, active) {
    return new Promise(resolve => chrome.tabs.create({ url, active }, resolve))
}

// https://developer.chrome.com/extensions/tabs#method-update
export function update (url) {
    return new Promise(resolve => chrome.tabs.update(null, { url }, resolve))
}

export function empty () {
    update('chrome://newtab/')
}

export async function isFinalTab () {
    const allTabs = await queryAll()
    return allTabs.length === 1
}

// https://developer.chrome.com/extensions/tabs#event-onUpdated
export function onComplete (newTab) {
    return new Promise(resolve => {
        chrome.tabs.onUpdated.addListener(listener)

        function listener (tabId, info) {
            if (isCompleteLoad() && isSameTab()) {
                chrome.tabs.onUpdated.removeListener(listener)
                resolve(tabId)
            }

            function isCompleteLoad () {
                return info.status === 'complete'
            }

            function isSameTab () {
                return newTab.id === tabId
            }
        }
    })
}
