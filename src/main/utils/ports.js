const serialport = remote?.require("serialport");

export const getPort = async () => {
  const results = await serialport.list();
  const port = results.find((result) => result.vendorId === "0403");
  if (!port) return false;
  return port.path;
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
