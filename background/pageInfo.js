import '../modules/prototypes/Object.mjs'
import '../modules/prototypes/String.mjs'
import * as request from './request.js'

class PageInfo {
    constructor (tab) {
        this.tab = tab
    }

    get url () {
        return this.tab.pendingUrl || this.tab.url
    }

    get title () {
        return this.tab.title || this.url
    }

    get hasTitle () {
        return this.url !== this.title
            && this.url !== this.tab.pendingUrl
    }

    get favIconUrl () {
        return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${this.url}&size=32`
    }

    get date () {
        return Date.now()
    }
}

class SelectionInfo extends PageInfo {
    constructor (tab, selection) {
        super(tab)
        this.selection = selection
    }

    get url () {
        // 超链接或当前页面
        return this.selection.linkUrl || this.selection.pageUrl
    }

    get title () {
        return this.selection.selectionText || this.url
    }

    get hasTitle () {
        if (typeof this.selection.selectionText !== "undefined"){   // 以选中内容作为标题
            return true
        }else { // 超链接标题留空
            return false
        }
    }
}

function createPageInfo (tab, selection) {
    return selection.isEmpty()
        ? new PageInfo(tab)
        : new SelectionInfo(tab, selection)
}

export function initPageInfo ({ tab, selection }) {
    const page = createPageInfo(tab, selection)
    return {
        url:        page.url,
        title:      page.title,
        hasTitle:   page.hasTitle,
        favIconUrl: page.favIconUrl,
        date:       page.date
    }
}

export async function completePageInfo (page) {
    if (!page.hasTitle) page.title = await request.getTitle(page.url)

    delete page.hasTitle
    return page
}
