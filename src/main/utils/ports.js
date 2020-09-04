const serialport = remote.require("serialport");

export const readPort = async (path) => {
  return await new Promise((resolve, _reject) => {
    const port = new serialport(path, { baudRate: 115200 });
    const parser = port.pipe(new serialport.parsers.Readline());

    parser.on("data", (text) => {
      if (text[0] === "{") {
        const data = JSON.parse(text);
        port.close();
        resolve(data);
      }
    });

    port.write('{ "status": true }\n');

    setTimeout(() => {
      resolve(false);
      if (port.isOpen) port.close();
    }, 20000);
  });
};

export const getPort = async () => {
  const results = await serialport.list();
  const port = results.find((result) => result.vendorId === "0403");
  if (!port) return false;
  return port.path;
};
