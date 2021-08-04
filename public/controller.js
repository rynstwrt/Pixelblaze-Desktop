const WebSocket = require('ws');
const _ = require('lodash');
const fetch = require('node-fetch');
const FormData = require('form-data');
const { BrowserWindow } = require("electron");

const PacketType = {
  SAVEPROGRAMSOURCEFILE: 1,
  CODEDATA: 3,
  THUMBNAILJPG: 4,
  PREVIEWFRAME: 5,
  SOURCESDATA: 6,
  PROGRAMLIST: 7,
  PIXELMAP: 8,
};
const PacketFrameFlags = {
  START: 1,
  CONTINUE: 2,
  END: 4
};

const PROPFIELDS = [
  'ver', 'fps', 'exp', 'vmerr', 'mem', 'pixelCount', 'ledType', 'dataSpeed', 'colorOrder', 'buferType', 'sequenceTimer', 'sequencerEnable', 'brightness', 'name'
];

function readAsUtf8(buf, cb) {
  var bb = new Blob([new Uint8Array(buf)]);
  var f = new FileReader();
  f.onload = function(e) {
    cb(e.target.result);
  };
  f.readAsText(bb);
}

/** ---------------------------------------------------- **/

Object.filter = (obj, predicate) =>
{
  Object.keys(obj)
      .filter(key => predicate(obj[key]))
      .reduce((res, key) => (res[key] === obj[key], res), {})
}

/** ---------------------------------------------------- **/

module.exports = class PixelblazeController {
  constructor(props, command) {
    this.props = props;
    this.command = _.clone(command || {}); //commands to send
    this.props.programList = [];
    this.partialList = [];
    this.lastSeen = 0;

    this.connect = this.connect.bind(this);
    this.handleConnect = this.handleConnect.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handlePong = this.handlePong.bind(this);
    this.setCommand = this.setCommand.bind(this);
  }

  start() {
    this.connect();
  }

  stop() {
    try {
      if (this.ws)
        this.ws.terminate();
    } catch (err) {
      // dont care!
    }
    clearTimeout(this.reconectTimeout);
  }

  connect() {
    if (this.ws && this.ws.readyState === this.ws.CONNECTING)
      return;
    this.stop();
    this.ws = new WebSocket('ws://' + this.props.address + ":81");
    this.ws.binaryType = "arraybuffer";
    this.ws.on('open', this.handleConnect);
    this.ws.on('close', () => this.handleClose);
    this.ws.on('message', this.handleMessage);
    this.ws.on('pong', this.handlePong);
    this.ws.on('error', () => {}); //otherwise it crashes :(
  }

  handleConnect() {
    console.log("connected to " + this.props.address);
    this.lastSeen = new Date().getTime();
    clearTimeout(this.reconectTimeout);
    this.sendFrame({getConfig: true, listPrograms: true, sendUpdates: false, ...this.command});
  }

  handleClose() {
    console.log("closing " + this.props.address);
    this.reconectTimeout = setTimeout(this.connect, 1000);
  }

  handleMessage(msg) {
    this.lastSeen = new Date().getTime();
    // console.log("data from " + this.props.id + " at " + this.props.address, typeof msg, msg);

    let props = this.props;
    if (typeof msg === "string") {
      try {
        _.assign(this.props, _.pick(JSON.parse(msg), PROPFIELDS));
      } catch (err) {
        console.err("Problem parsing packet", err);
      }
    } else {

      var buf = new Uint8Array(msg);
      if (buf.length < 1)
        return;
      var type = buf[0];

      switch (type) {
        case PacketType.PREVIEWFRAME:
          break;
        case PacketType.THUMBNAILJPG:
          break;
        case PacketType.SOURCESDATA:
          break;
        case PacketType.PROGRAMLIST:
          let data = buf.slice(2);
          let flags = buf[1];

          if (flags & PacketFrameFlags.START) {
            this.partialList = [];
          }

          let text = Buffer.from(data).toString('utf8')
          let lines = text.split("\n");
          let programs = _.map(_.filter(lines), function (line) {
            let bits = line.split("\t");
            return {id: bits[0], name: bits[1]};
          });
          this.partialList = this.partialList.concat(programs);
          if (flags & PacketFrameFlags.END) {
            props.programList = this.partialList;
            // console.log("received programs", props.id, props.programList);
          }
          break;
          /** -------------------------------------------- **/
        case 123:
          const jsonString = String.fromCharCode.apply(null, buf)
          const json = JSON.parse(jsonString);

          if (json.controls)
          {
            console.log(props);

            const controls = json.controls[Object.keys(json.controls)[0]]

            console.log("FOUND CONTROLS!");
            console.log(controls);

            BrowserWindow.getFocusedWindow().webContents.send("create-controls", controls);
          }
          break;
          /** -------------------------------------------- **/
        default:
          console.log(msg);
          break;
      }
    }
  }

  ping() {
    const isDisconnected = this.ws && this.ws.readyState !== this.ws.OPEN;
    if (!isDisconnected)
      this.ws.ping();
  }
  isAlive() {
    let now = new Date().getTime();
    return now - this.lastSeen < 5000 && this.ws.readyState !== this.ws.CLOSED;
  }
  handlePong() {
    this.lastSeen = new Date().getTime();
  }

  setCommand(command) {
    let {programName, ...rest} = command;
    if (programName) {
      rest = rest || {};
      let program = _.find(this.props.programList, {name: programName});
      if (program) {
        rest.activeProgramId = program.id;
      }
      command = rest; //replace command with fixed version
    }

    //see if those keys values are different
    let keys = _.keys(command);
    if (_.isEqual(_.pick(command, keys), _.pick(this.command, keys)))
      return;
    _.assign(this.command, command);
    this.sendFrame(command);
  }

  reload() {
    this.sendFrame({getConfig: true, listPrograms: true});
  }

  async getProgramBinary(programId, extension = "") {
    let extensionDesc = (extension == ".c") ? " controls" : ""
    console.log("getting program" + programId + extensionDesc + " from " + this.props.address);
    var resp = await fetch('http://' + this.props.address + "/p/" + programId + extension, {
      responseType: 'blob',
    });
    return await resp.body;
  }

  sendFrame(o) {
    const frame = JSON.stringify(o);
    const isDisconnected = this.ws && this.ws.readyState !== this.ws.OPEN;
    console.log(isDisconnected ? "wanted to send" : "sending to " + this.props.id + " at " + this.props.address, frame);
    if (isDisconnected)
      return;
    this.ws.send(frame);
  }
}
