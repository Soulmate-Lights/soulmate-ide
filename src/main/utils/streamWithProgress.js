/* eslint-disable no-undef */

export default async function streamWithProgress(
  length,
  reader,
  writer,
  progressCallback
) {
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
