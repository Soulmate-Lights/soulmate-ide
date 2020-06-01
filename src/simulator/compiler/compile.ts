// const url = "https://hexi.wokwi.com/build";
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
    credentials: 'same-origin',
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sketch: source, board: "mega" }),
  });
  return (await resp.json()) as IHexiResult;
}
