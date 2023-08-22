import * as storage from '../modules/chrome/storage.mjs'

$(async function () {
    const { options } = await storage.sync.get('options')
    $('#itemNewTab').prop('checked', options?.itemNewTab)
    $('#keepSavedTab').prop('checked', options?.keepSavedTab)
    $('#urlInput').val(options?.url)
})

$('input[type=checkbox], #urlInput').on('change paste input', async function () {
    const options = {
        itemNewTab:   $('#itemNewTab').prop('checked'),
        keepSavedTab: $('#keepSavedTab').prop('checked'),
        url:          $('#urlInput').val(),
        isOptions:    true,
    }
    await storage.sync.set({ options })
})
