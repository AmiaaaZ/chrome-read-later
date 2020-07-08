export function renderListFrom(page, favIconBase64) {
  return `
      <li id=${page.date} title="${getTitleAttribute()}" tabindex="1">
        <img src="${favIconBase64 || page.favIconUrl}" alt="">
        <a href="${page.url}" ${getTitleColor()} tabindex="-1">${encodeTitle()}</a>
        ${getScrollPercent()}
      </li>
    `

  function getTitleAttribute() {
    return page.title === page.url ? page.url : `${encodeTitle()}\n\n${page.url}`
  }

  function getTitleColor() {
    return page.url === page.title ? 'style="color: gray"' : ''
  }

  function encodeTitle() {
    // eslint-disable-next-line no-undef
    return he.encode(page.title)
  }

  function getScrollPercent() {
    return page.scroll.top
      ? `<span class="position">${page.scroll.percent}</span>`
      : ''
  }
}

export function showDeleteIcon(event) {
  localStorage.setItem('src', event.target.src)
  event.target.src = isDarkMode() ? '../assets/icons/delete-white32x32.png' : '../assets/icons/delete-black32x32.png'
}

function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function showFavIcon(event) {
  event.target.src = localStorage.getItem('src')
}
