import { downloadTemporaryFile } from "./download.js";
import { randomUUID } from "node:crypto";
import ffmpeg from "fluent-ffmpeg";
import { tmpdir } from "node:os";
import path from "node:path";

/**
 *
 * @param {import("discord.js").Message} message
 */
export async function getAudioObject(message) {
  /** @type {import("discord.js").Attachment} */
  let attachedAudio;
  for (const [key, value] of message.attachments) {
    if (value.contentType.startsWith("audio")) {
      attachedAudio = value;
      break;
    }
  }
  const temporaryFile = await downloadTemporaryFile(
    attachedAudio,
    attachedAudio.name
  );
  console.log(temporaryFile);
  return temporaryFile;
}

export async function stretchAudio({ fileName, outputFileName, factor }) {
  const temporaryDirectory = tmpdir();
  console.log(fileName);
  outputFileName = path.join(
    temporaryDirectory,
    outputFileName ?? randomUUID() + "." + fileName.split(".").at(-1)
  );
  console.log(outputFileName);
  return new Promise((resolve, reject) => {
    ffmpeg(fileName)
      .audioFilters(
        "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB:stop_periods=-1:stop_silence=0.1:stop_threshold=-50dB",
        `rubberband=tempo=${factor}:pitch=1.0`
      )
      .output(outputFileName)
      .outputOptions("-y")
      .on("end", () => resolve(outputFileName))
      .on("error", reject)
      .run();
  });
}

export async function pitchShiftAudio({ fileName, outputFileName, factor }) {
  const temporaryDirectory = tmpdir();
  outputFileName = path.join(
    temporaryDirectory,
    outputFileName ?? randomUUID() + "." + fileName.split(".").at(-1)
  );
  return new Promise((resolve, reject) => {
    ffmpeg(fileName)
      .audioFilters(
        "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB:stop_periods=-1:stop_silence=0.1:stop_threshold=-50dB",
        `rubberband=pitch=${factor}:tempo=1.0`
      )
      .output(outputFileName)
      .outputOptions("-y")
      .on("end", () => resolve(outputFileName))
      .on("error", reject)
      .run();
  });
}

export async function loopAudio({ fileName, outputFileName, times }) {
  const temporaryDirectory = tmpdir();
  outputFileName = path.join(
    temporaryDirectory,
    outputFileName ?? randomUUID() + "." + fileName.split(".").at(-1)
  );

  return new Promise((resolve, reject) => {
    ffmpeg(fileName)
      .audioFilters(
        "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-50dB:stop_periods=-1:stop_silence=0.1:stop_threshold=-50dB",
        `aloop=loop=${times - 1}:size=2e9`
      )
      .output(outputFileName)
      .outputOptions("-y")
      .on("end", () => resolve(outputFileName))
      .on("error", reject)
      .run();
  });
}
