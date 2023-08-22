import * as data from './pageInfo.js'
import * as storage from '../modules/chrome/storage.mjs'
import * as tabs from '../modules/chrome/tabs.mjs'
import * as localStore from '../modules/localStore/localStore.mjs'

export async function saveSelection (tab, selection) {
    await updateStorage({ tab, selection })
}

async function updateStorage ({ tab, position = {}, selection = {} }) {
    let page = data.initPageInfo({ tab, position, selection })
    await storage.sync.set(page)
    await storage.local.set(page)

    if (!page.url.isHttp()) return
    page = await data.completePageInfo(page)
    await storage.sync.set(page)
    await storage.local.set(page)

    const { options } = await storage.sync.get('options')
    if (options.url !== ''){
        await uploadStorage(options.url, page, 'add')
    }

    // add 'done' status badge for all conditions
    await chrome.action.setBadgeText({ text: 'done' })
    setTimeout(() => chrome.action.setBadgeText({ text: '' }), 1500)
}

async function uploadStorage (url, page, flag){
    // set timeout to 5s
    const controller = new AbortController()
    const timeout = setTimeout(function () {
        controller.abort();
        console.error('Request timeout')
    }, 5000)

    // add data to api-server, such as: http://127.0.0.1/api/ + add
    // TODO: sync with Notion API
    fetch(url + flag, {
        method: 'POST',
        headers: {
          // 'Authorization': `Basic ${btoa('api:xxxxxx')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: page.title, url: page.url}),
        signal: controller.signal
    }).then(function (response) {
        clearTimeout(timeout)
        if (response.ok) {
            return response.json()
        } else {
            throw new Error('Request failed')
        }
    }).then(function (data) {
       console.log(data)
    }).catch(function (error) {
       console.error(error)
    });
}

export async function savePage () {
    const tab = await tabs.queryCurrent()
    const position = await tabs.sendMessage(tab.id, { info: 'get position' })
    const { options } = await storage.sync.get('options')

    await updateStorage({ tab, position })
}

export async function openPage ({ url, currentTab, active, isHistory }) {
    const tab = currentTab ? await tabs.update(url) : await tabs.create(url,
        active)
    const position = isHistory
        ? await storage.local.getPosition(url)
        : await storage.sync.getPosition(url)
    const tabId = await tabs.onComplete(tab)
    await tabs.sendMessage(tabId, { ...position, info: 'set position' })
}

export function removeDeletePages () {
    localStore.getArray('deletedSyncUrls')
        .then(data => data.map(url => storage.sync.remove(url)))
        .then(() => localStore.getArray('deletedLocalUrls'))
        .then(data => data.map(url => storage.local.remove(url)))
        .then(localStore.clear)

}

export async function migrateStorage () {
    await upgradeStorage('sync')
    await upgradeStorage('local')

    function upgradeFaviconUrl (url) {
        const oldPrefix = 'chrome://favicon/size/16@2x/'
        const newPrefix = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=`
        return url.replace(oldPrefix, newPrefix) + '&size=32'
    }

    async function upgradeStorage (key) {
        const pages = await storage[key].get()
        for (const page of Object.values(pages)) {
            page.favIconUrl = upgradeFaviconUrl(page.favIconUrl)
            await storage[key].set(page)
        }
    }
}
