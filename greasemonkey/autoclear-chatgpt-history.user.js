// ==UserScript==
// @name                Autoclear ChatGPT History
// @name:zh-CN          自动清除 ChatGPT 历史记录
// @name:zh-SG          自动清除 ChatGPT 历史记录
// @name:zh-TW          自動清除 ChatGPT 歷史記錄
// @name:zh-HK          自動清除 ChatGPT 歷史記錄
// @name:ja             ChatGPT 履歴の自動消去
// @name:ko             ChatGPT 기록 자동 삭제
// @name:ru             Автоочистка Истории ChatGPT
// @name:de             ChatGPT-Verlauf Automatisch Löschen
// @name:es             Borrar Automáticamente el Historial de ChatGPT
// @name:fr             Effacement Automatique de L'Historique ChatGPT
// @name:it             Cancella Automaticamente Cronologia ChatGPT
// @version             2023.5.2.2
// @description         Auto-clears chat history when visiting chat.openai.com
// @author              Adam Lui (刘展鹏), Tripp1e & Xiao-Ying Yo (小影哟)
// @namespace           https://github.com/adamlui
// @namespace           https://github.com/Tripp1e
// @namespace           https://github.com/XiaoYingYo
// @description:zh-CN   访问 chat.openai.com 时自动清除聊天记录
// @description:zh-SG   访问 chat.openai.com 时自动清除聊天记录
// @description:zh-TW   訪問 chat.openai.com 時自動清除聊天記錄
// @description:zh-HK   訪問 chat.openai.com 時自動清除聊天記錄
// @description:ja      chat.openai.com にアクセスすると、チャット履歴が自動的に消去されます
// @description:ko      chat.openai.com 방문 시 채팅 기록 자동 삭제
// @description:ru      Автоматически очищает историю чата при посещении chat.openai.com
// @description:de      Löscht den Chat-Verlauf automatisch, wenn Sie chat.openai.com besuchen
// @description:es      Borra automáticamente el historial de chat al visitar chat.openai.com
// @description:fr      Efface automatiquement l'historique des discussions lors de la visite de chat.openai.com
// @description:it      Cancella automaticamente la cronologia chat quando visiti chat.openai.com
// @license             MIT
// @icon                https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/media/icons/openai-favicon48.png
// @icon64              https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/media/icons/openai-favicon64.png
// @compatible          chrome
// @compatible          edge
// @compatible          firefox
// @compatible          opera
// @compatible          brave
// @compatible          vivaldi
// @compatible          librewolf
// @compatible          ghost
// @compatible          qq
// @match               https://chat.openai.com/*
// @run-at              document-end
// @require             https://cdn.jsdelivr.net/gh/chatgptjs/chatgpt.js@6f86ebd392312d2521a5c814c8df721ba55965a3/dist/chatgpt-1.6.2.min.js
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_registerMenuCommand
// @grant               GM_unregisterMenuCommand
// @noframes
// @updateURL           https://greasyfork.org/scripts/460805/code/autoclear-chatgpt-history.meta.js
// @downloadURL         https://greasyfork.org/scripts/460805/code/autoclear-chatgpt-history.user.js
// @homepageURL         https://github.com/adamlui/autoclear-chatgpt-history
// @supportURL          https://github.com/adamlui/autoclear-chatgpt-history/issues
// ==/UserScript==

// NOTE: This script relies on the powerful chatgpt.js library @ https://chatgpt.js.org (c) 2023 Adam Lui, chatgpt.js & contributors under the MIT license.

(function() {

    // Define script functions

    function registerMenu() {
        var menuID = [] // to store registered commands for removal while preserving order

        // Add 'Toggle Visibility' command
        var tvStateSymbol = ['✔️', '❌']
        var tvStateWord = ['ON', 'OFF']
        var tvLabel = tvStateSymbol[+config.toggleHidden] + ' Toggle Visibility'
            + (getUserscriptManager() === 'Tampermonkey' ? ' — ' : ': ')
            + tvStateWord[+config.toggleHidden]
        menuID.push(GM_registerMenuCommand(tvLabel, function() {
            saveSetting('toggleHidden', !config.toggleHidden)
            toggleLabel.style.display = config.toggleHidden ? 'none' : 'flex' // toggle visibility
            for (var id of menuID) { GM_unregisterMenuCommand(id) } registerMenu() // refresh menu
        }))
    }

    function getUserscriptManager() { try { return GM_info.scriptHandler } catch (error) { return 'other' }}

    function loadSetting(...keys) {
        keys.forEach(function(key) {
            config[key] = GM_getValue(configKeyPrefix + key, false)
    })}

    function saveSetting(key, value) {
        GM_setValue(configKeyPrefix + key, value) // save to browser
        config[key] = value // and memory
    }

    function updateToggleHTML() {
        toggleLabel.innerHTML = `
            <img width="18px" src="https://raw.githubusercontent.com/adamlui/autoclear-chatgpt-history/main/media/images/icons/navicon.png">
            Auto-clear ${config.autoclear ? 'enabled' : 'disabled'}
            <label class="switch" ><input id="autoclearToggle" type="checkbox"
                ${config.autoclear ? 'checked="true"' : '' } >
                <span class="slider"></span></label>`
        toggleLabel.style.display = config.toggleHidden ? 'none' : 'flex'
    }

    function insertToggle() {
        var firstMenu = document.querySelector('nav')
        if (!firstMenu.contains(toggleLabel)) { // check if label exists first // 检查标签是否首先存在
            firstMenu.insertBefore(toggleLabel, firstMenu.childNodes[0]) // insert before 'New chat'// 在"新聊天"之前插入
    }}

    function toggleAutoclear() {
        var toggleInput = document.querySelector('#autoclearToggle')
        if (event.target == toggleLabel) toggleInput.click() // to avoid double-toggle
        setTimeout(updateToggleHTML, 200) // sync label change w/ switch movement
        saveSetting('autoclear', toggleInput.checked)
    }

    async function InitSvg() {
        return new Promise(async (resolve) => {
            let Svg = GM_getValue('clearSvg', [])
            if (Svg.length !== 0) {
                clearSvg = Svg
                resolve(true)
                return
            }
            let json = fetchMap.get('conversations')
            if (json && json.items && json.items.length == 0) {
                resolve(false)
                return
            }
            let menuButton = document.querySelector('button[id^="headlessui-menu-button-"]')
            menuButton.click()
            let menuitems = [];
            await new Promise((resolve) => {
                let Timer = setInterval(() => {
                    menuitems = document.querySelectorAll('a[role="menuitem"]')
                    if (menuitems.length < 4) {
                        return;
                    }
                    clearInterval(Timer)
                    resolve()
                }, 100)
            });
            let menuitem = menuitems[1]
            if (menuitem.name === 1) {
                return
            }
            let svg = menuitem.querySelector('svg')
            clearSvg = []
            clearSvg.push(svg.outerHTML)
            menuitem.click()
            setTimeout(() => {
                svg = menuitem.querySelector('svg')
                clearSvg.push(svg.outerHTML)
                menuitem.name = 1
                menuitem.remove()
                console.log(clearSvg)
                menuButton.click()
                GM_setValue('clearSvg', clearSvg)
                resolve(true);
            }, 100)
        });
    }

    async function hookFetch() {
        let unsafeWindow = document.defaultView
        const originalFetch = unsafeWindow.fetch
        unsafeWindow.fetch = function(...args) {
            (async function() {
                let U = args[0]
                if (U.indexOf('http') == -1) return
                let url = new URL(U), pathname = url.pathname, callback = fetchMap.get(pathname)
                if (callback == null) return
                callback(await originalFetch.apply(this, args))
            })()
            return originalFetch.apply(this, args)
    }}

    function createOrShowClearButton(Show = null) {
        if (document.getElementById('_clearButton_') != null) {
            if (Show != null) document.getElementById('_clearButton_').style.display = Show
            return
        }
        let border = document.querySelectorAll('div[class^="border-"]')
        border = border[border.length - 1]
        let div = document.createElement('div')
        div.id = '_clearButton_'
        let className = border.childNodes[0].className
        div.className = className
        border.insertBefore(div, border.childNodes[0]);
        (async function() {
            if (clearSvg == null) { 
                if (!await InitSvg()) { 
                    return
                }
            }
            div.innerHTML = clearSvg[0] + 'Clear Conversations'
            div.name = 0
            div.addEventListener('click', function() {
                let json = fetchMap.get('conversations')
                if (json.items.length == 0) {
                    div.name = 0 ; div.innerHTML = clearSvg[div.name] + 'Clear Conversations'
                    return
                }
                if (div.name === 0) div.name = 1
                else { createOrShowClearButton('none') ; div.name = 0 ; chatgpt.clearChats() }
                div.innerHTML = clearSvg[div.name] + 'Confirm Clear Conversations'
            })
        })()
    }

    // Run MAIN routine

    // Initialize script
    var config = {}, configKeyPrefix = 'chatGPTac_' // initialize config variables
    loadSetting('autoclear', 'toggleHidden') // load script settings
    registerMenu() // create browser toolbar menu

    // Stylize/insert toggle switch
    var switchStyle = document.createElement('style')
    switchStyle.innerHTML = `/* Stylize switch */
        .switch { position:absolute ; left:208px ; width:34px ; height:18px }
        .switch input { opacity:0 ; width:0 ; height:0 } /* hide checkbox */
        .slider { position:absolute ; cursor:pointer ; top:0 ; left:0 ; right:0 ; bottom:0 ; background-color:#ccc ; -webkit-transition:.4s ; transition:.4s ; border-radius:28px }
        .slider:before { position:absolute ; content:"" ; height:14px ; width:14px ; left:3px; bottom:2px ; background-color:white ; -webkit-transition:.4s ; transition:.4s ; border-radius:28px }

        /* Position/color ON-state */
        input:checked { position:absolute ; right:3px }
        input:checked + .slider { background-color:#42B4BF }
        input:checked + .slider:before {
            -webkit-transform: translateX(14px) translateY(1px) ;
            -ms-transform: translateX(14px) translateY(1px) ;
            transform: translateX(14px) }`
    document.head.appendChild(switchStyle)

    // Stylize clear button icons
    var clearSvg = null;

    // Initialize/fill conversation map
    var fetchMap = new Map()
    fetchMap.set('conversations', {})
    fetchMap.set('/backend-api/conversations', async function(f) {
        let json = await f.json()
        fetchMap.set('conversations', json)
        createOrShowClearButton(null)
        if (json.items.length === 0) createOrShowClearButton('none')
        else createOrShowClearButton('')
    })
    hookFetch()

    // Create toggle label & add listener/classes/HTML
    var toggleLabel = document.createElement('div') // create label div
    toggleLabel.addEventListener('click', (event) => { toggleAutoclear(event) })
    for (var link of document.querySelectorAll('a')) { // inspect sidebar links for classes
        if (link.innerHTML.includes('New chat')) { // focus on 'New chat'
            toggleLabel.setAttribute('class', link.classList) // borrow its classes
            break // stop looping since class assignment is done
        }
    } updateToggleHTML()

    // Insert full toggle on page load + during navigation // 在导航期间插入页面加载 + 的完整切换
    insertToggle()
    var navObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                insertToggle()
            }
        })
    })
    navObserver.observe(document.documentElement, { childList: true, subtree: true })

    // Auto-clear chats if activated // 自动清除聊天是否激活
    var clearObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function() {
            var clearButton = document.getElementById('_clearButton_')
            if (clearButton) {
                if (clearButton.style.display != 'none') {
                    setTimeout(chatgpt.clearChats, 250) ; clearObserver.disconnect()
    }}})})
    if (config.autoclear) {
        clearObserver.observe(document, { childList: true, subtree: true })
        // Auto-disconnect after 3.5sec to avoid clearing new chats // 还要在3.5秒后断开连接,以避免清除新的频道
        setTimeout(function() { clearObserver.disconnect() }, 3500)
    }

})()
