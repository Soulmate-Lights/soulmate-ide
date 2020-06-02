// const url = "https://hexi.wokwi.com/build";
// const remote = require('electron').remote;
// import electron from 'electron';
// var { remote } = require('electron');
// var electronFs = remote.require('fs');

// const { remote } = electron;
// const fs = remote.require('fs');
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

export async function getFullBuild(source: string) {
  const res = await window.fetch('http://localhost:8080/build', {
    method: "POST",
    mode: "cors",
    credentials: 'same-origin',
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
  const finalLength = length || parseInt(res.headers.get('Content-Length' || '0'), 10);
  await streamWithProgress(finalLength, reader, writer, () => { });

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
      throw Error('Empty chunk received during download');
    } else {
      writer.write(Buffer.from(chunk));
      if (progressCallback != null) {
        bytesDone += chunk.byteLength;
        const percent = length === 0 ? null : Math.floor(bytesDone / length * 100);
        progressCallback(bytesDone, percent);
      }
    }
  }
}


// export default async function download(sourceUrl, targetFile, progressCallback, length) {
//   const request = new Request(sourceUrl, {
//     headers: new Headers({'Content-Type': 'application/octet-stream'})
//   });

//   const response = await fetch(request);
//   if (!response.ok) {
//     throw Error(`Unable to download, server returned ${response.status} ${response.statusText}`);
//   }

//   const body = response.body;
//   if (body == null) {
//     throw Error('No response body');
//   }

//   const finalLength = length || parseInt(response.headers.get('Content-Length' || '0'), 10);
//   const reader = body.getReader();
//   const writer = fs.createWriteStream(targetFile);

//   await streamWithProgress(finalLength, reader, writer, progressCallback);
//   writer.end();
// }

// async function streamWithProgress(length, reader, writer, progressCallback) {
//   let bytesDone = 0;

//   while (true) {
//     const result = await reader.read();
//     if (result.done) {
//       if (progressCallback != null) {
//         progressCallback(length, 100);
//       }
//       return;
//     }

//     const chunk = result.value;
//     if (chunk == null) {
//       throw Error('Empty chunk received during download');
//     } else {
//       writer.write(Buffer.from(chunk));
//       if (progressCallback != null) {
//         bytesDone += chunk.byteLength;
//         const percent = length === 0 ? null : Math.floor(bytesDone / length * 100);
//         progressCallback(bytesDone, percent);
//       }
//     }
//   }
// }