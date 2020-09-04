const url = "https://editor.soulmatelights.com/sketches/build";
import streamWithProgress from "~/utils/streamWithProgress";

// export interface IHexiResult {
//   stdout: string;
//   stderr: string;
//   hex: string;
// }

export async function buildHex(source) {
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
  return await resp.json();
}

export async function getFullBuild(source) {
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

  if (!res.ok) return false;

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
