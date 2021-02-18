import uniq from "lodash/uniq";

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const renameDefines = (sketch, prefix) => {
  prefix ||= makeid(3);
  let defines = [];

  sketch.split("\n").forEach((line) => {
    if (line.trim().includes("#define ")) {
      let declaration = line.trim().split("#define ")[1].trim();
      declaration = declaration.split(/[^A-Za-z0-9\s]/i)[0];
      let [key] = declaration.split(" ");
      defines.push(key.trim());
    }

    return line;
  });

  defines = uniq(defines);

  defines.forEach((define) => {
    sketch = sketch
      .split("\n")
      .map((line) => line.replaceAll(define, `${prefix}${define}`))
      .join("\n");
  });

  return sketch;
};

export default renameDefines;
