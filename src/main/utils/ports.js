let serialport;
if (window.require) serialport = window.require("serialport");

const vendorIds = ["1a86", "10c4", "0403"].map((v) => v.toLowerCase());
const paths = ["usbserial", "tty.wchusbserial", "cu.SLAB_USBtoUART"].map((p) =>
  p.toLowerCase()
);

const isMatchingPort = (port) => {
  const { vendorId, path } = port;

  if (
    vendorIds.includes(vendorId?.toLowerCase()) ||
    paths.find((p) => path.includes(p?.toLowerCase()))
  )
    return true;

  return false;
};

export const getPort = async () => {
  const ports = await getPorts();
  const port = ports[0];
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
