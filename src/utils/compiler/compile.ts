const url = "https://editor.soulmatelights.com/sketches/build";

export interface IHexiResult {
  stdout: string;
  stderr: string;
  hex: string;
}

export async function buildHex(source: string) {
  const resp = await fetch(url, {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sketch: source, board: "mega" }),
  });
  return (await resp.json()) as IHexiResult;
}

export async function getFullBuild(source: string) {
  const res = await window.fetch("http://54.243.44.4:8081/build", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sketch: source }),
  });

  const path = electron.remote.app.getPath("temp");
  const filename = parseInt(Math.random() * 10000000);
  const filePath = `${path}${filename}.bin`;
  const writer = fs.createWriteStream(filePath);
  const reader = res.body.getReader();
  const finalLength =
    length || parseInt(res.headers.get("Content-Length" || "0"), 10);
  await streamWithProgress(finalLength, reader, writer, () => {});

  return filePath;
}

async function streamWithProgress(length, reader, writer, progressCallback) {
  let bytesDone = 0;

  while (true) {
    const result = await reader.read();
    if (result.done) {
      if (progressCallback != null) {
        progressCallback(length, 100);
      }
      return;
    }

    const chunk = result.value;
    if (chunk == null) {
      throw Error("Empty chunk received during download");
    } else {
      writer.write(Buffer.from(chunk));
      if (progressCallback != null) {
        bytesDone += chunk.byteLength;
        const percent =
          length === 0 ? null : Math.floor((bytesDone / length) * 100);
        progressCallback(bytesDone, percent);
      }
    }
  }
}
