<p align="center">
  <img src="assets/images/logotype.png" alt="Read Later Logo" height="150px"><br>
  <sub>Dedicated to my good friend <a href="https://github.com/evestorm">@evestorm</a></sub><br>
  A temporary bookmark focuses on reading later, rather than closing and removing.
</p>

## Installation
<a href="https://chrome.google.com/webstore/detail/fbmfcfkokefgbmfcjahdmomlifclekib/">
  <img src="assets/images/chrome-store-logo.png" width="250px" alt="chrome-store-logo">
</a>

[Manual Installation](https://github.com/willbchang/chrome-read-later/wiki/Manual-Installation)


## Usages
### Mouse Click
In the browser:
- <kbd>Right Click</kbd> link and select **Read Later** in context menus to save the target link info.
- <kbd>Right Click</kbd> page and select **Read Later** in context menus to save page info and close current tab.
- <kbd>Click</kbd> the icon to open the reading List.

In the reading list:
- <kbd>Click</kbd>(image): delete current link.
- <kbd>Click</kbd>(link): open link in a new tab.
- <kbd>Alt</kbd> + <kbd>Click</kbd>(link): open select link in the current tab.
- <kbd>Command</kbd> + <kbd>Click</kbd>(link): open select link in a new tab and stay in the current tab.

### Keyboard Shortcuts
In the browser:
- <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>: **Save** current page info.
- <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>: **Zoom Out** reading list.

In the reading list:
- <kbd>↑</kbd>: move to next link.
- <kbd>↓</kbd>: move to previous link.
- <kbd>Backspace</kbd>: delete current link.
- <kbd>Enter</kbd>: open select link in a new tab.
- <kbd>Alt</kbd> + <kbd>Enter</kbd>: open select link in the current tab.
- <kbd>Command</kbd> + <kbd>Enter</kbd>: open select link in a new tab and stay in the current tab.

For Vim user:
- <kbd>j</kbd>: move to next link.
- <kbd>k</kbd>: move to previous link.
- <kbd>gg</kbd>: move to the first link.
- <kbd>G</kbd>: move to the last link.
- <kbd>dd</kbd>: delete a link.
- <kbd>u</kbd>: restore a deletion.

## Features
- It saves almost all kinds of pages in any situation: `http://`, `https://`, `chrome://`, `localhost:`...
- It saves the reading progress of current page, **works on most pages**(I'll improving it).
- It syncs the reading list to your browser(sign in google account first) automatically, you can use one reading list with multiple Chrome Browsers.
Check [todo list](https://github.com/willbchang/chrome-read-later/wiki/TODO).
Known Issues: cannot save scroll position from `*.google.com`, `https://manga.bilibili.com/*`, or some sites has multiple scroll bars.

## Contribution
Please read [contribution guide](https://github.com/willbchang/chrome-read-later/wiki/Contribution-Guide) first.
I explained the code structure and conventions to help you understand quickly. 😄

### Contributor
|                              Logo Designer                              |
| :---------------------------------------------------------------------: |
| ![Yasujizr](https://avatars0.githubusercontent.com/u/36993664?s=88&v=4) |
|                 [Yasujizr](https://github.com/Yasujizr)                 |

## Credits
- Special thanks to my girl friend YangYang, she gave me a lot of helpful suggestions, feedback and encouragement.
- Delete icon made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com </a>

## LICENSE
[MIT](LICENSE)
