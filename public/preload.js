const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener('DOMContentLoaded', () =>
{
    const replaceText = (selector, text) =>
    {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron'])
    {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

const validSendChannels = ["PD-load-patterns", "PD-slider-changed", "PD-pattern-button-clicked"]
const validReceiveChannels = ["create-pattern-buttons", "create-controls"]
contextBridge.exposeInMainWorld(
    "api", {
        // data going to main
        send: (channel, data) =>
        {
            if (validSendChannels.includes(channel))
            {
                ipcRenderer.send(channel, data)
            }
        },

        // data going to window
        receive: (channel, func) =>
        {
            if (validReceiveChannels.includes(channel))
            {
                ipcRenderer.on(channel, (e, ...args) => func(...args));
            }
        }
    }
)