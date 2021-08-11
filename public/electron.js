const path = require("path")
const { app, BrowserWindow, ipcMain } = require("electron")
const isDev = require("electron-is-dev")
const discovery = require("./discovery")


let numPixelblazeOnNetwork = undefined;


let win;
function createWindow()
{
    win = new BrowserWindow({
        width: isDev ? 1200 : 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    win.removeMenu();

    if (isDev) win.openDevTools();

    win.loadURL(isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, '../build/index.html')}`);
}


// called when the electron app is ready
app.whenReady().then(() =>
{
    discovery.start({
        host: "0.0.0.0",
        port: "1889"
    });

    createWindow();

    app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() });
})


// called when all electron windows are closed
app.on("window-all-closed", () =>
{
    const discoveries = discovery.discoveries
    for (let discoveryId in discoveries)
    {
        const d = discoveries[discoveryId];
        const c = d.controller;
        if (c && c.isAlive()) c.stop();
    }

    if (process.platform !== "darwin") app.quit();
})


// helper function for the PD-slider-changed listener
Object.size = obj =>
{
    let size = 0;
    let key;

    for (key in obj)
    {
        if (obj.hasOwnProperty(key)) ++size;
    }

    return size;
}


// called when the load patterns button is clicked
ipcMain.on("PD-load-patterns", (e, numPixelblaze) =>
{
    numPixelblazeOnNetwork = numPixelblaze
    const discoveries = discovery.discoveries;

    let programIds = [];
    let patterns = {};
    for (let discoveryId in discoveries)
    {
        const d = discoveries[discoveryId];
        const c = d.controller;

        if (c && c.props.programList)
        {
            const programList = c.props.programList;
            for (let i = 0; i < programList.length; ++i)
            {
                const program = programList[i];
                programIds.push(program.id);

                const counts = {};
                for (const num of programIds)
                    counts[num] = (counts[num] || 0) + 1;

                if (counts[program.id] === parseInt(numPixelblazeOnNetwork))
                    patterns[program.id] = program.name;

            }
        }
    }

    sendFrameToAllDiscoveries({ brightness: .5 });
    win.webContents.send("create-pattern-buttons", patterns);
})


// called when a control slider is changed
ipcMain.on("PD-slider-changed", (e, data) =>
{
    const sliderValue = data[0];
    const propertyName = data[1];
    console.log(sliderValue, propertyName);

    sendFrameToAllDiscoveries({ [propertyName]: sliderValue })
})


// called when a pattern button is pressed
ipcMain.on("PD-pattern-button-clicked", (e, patternId) =>
{
    sendFrameToAllDiscoveries({
        activeProgramId: patternId,
        getControls: patternId
    });
});


// helper function to send frames to all the discoveries
function sendFrameToAllDiscoveries(frame)
{
    const discoveries = discovery.discoveries;
    if (Object.size(discoveries) === 0) return

    for (let discoveryId in discoveries)
    {
        const d = discoveries[discoveryId];

        if (d.controller)
        {
            d.controller.sendFrame(frame);
        }
    }
}
