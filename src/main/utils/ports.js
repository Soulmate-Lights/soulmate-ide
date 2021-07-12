let serialport;
if (window.require) serialport = window.require("serialport");

const isMatchingPort = (port) => {
  const { vendorId, path } = port;

  if (["1a86", "10c4", "0403"].includes(vendorId)) return true;
  if (path.includes("usbserial")) return true;
  if (path.includes("tty.wchusbserial")) return true;
  if (path.includes("cu.SLAB_USBtoUART")) return true;
};

export const getPort = async () => {
  const port = getPorts()[0];
  return port ? port.path : false;
};

export const getPorts = async () => {
  const results = await serialport.list();
  const ports = results.filter(isMatchingPort);
  return ports;
};

export class PortListener {
  constructor(path, callback) {
    this.path = path;
    this.callback = callback;

    if (path) {
      console.log("Listening to", path);
      const port = new serialport(path, { baudRate: 115200 });
      this.port = port;
      const parser = port.pipe(new serialport.parsers.Readline());
      parser.on("data", callback);
      this.port.write('{ "status": true }\n');
    } else {
      console.log("No port path given");
    }
  }

  close() {
    if (this.port && this.port?.isOpen) {
      this.port.close();
    }
  }
}
