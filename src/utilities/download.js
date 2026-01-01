import { createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { finished } from "node:stream/promises";
import axios from "axios";

/**
 *
 * @param {import("discord.js").Attachment} file
 * @param {*} fileName
 * @returns
 */
export async function downloadTemporaryFile(file) {
  const temporaryDirectory = tmpdir();
  const temporaryFilePath = path.join(temporaryDirectory, file.name);
  const fileURL = file.url;
  try {
    const response = await axios({
      url: fileURL,
      method: "GET",
      responseType: "stream",
    });
    const writer = createWriteStream(temporaryFilePath);
    response.data.pipe(writer);

    await finished(writer);
    return temporaryFilePath;
  } catch (error) {
    console.log(error);
  }
}
