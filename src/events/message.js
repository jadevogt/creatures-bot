import { AttachmentBuilder, Events } from "discord.js";
import {
  getAudioObject,
  loopAudio,
  pitchShiftAudio,
} from "../utilities/audio.js";
import { stretchAudio } from "../utilities/audio.js";

const checkMessageAudio = (message) => {
  if (message.content.startsWith("$pitch")) return true;
  if (message.content.startsWith("$tempo")) return true;
  if (message.content.startsWith("$loop")) return true;
  return;
};

export default [
  {
    name: Events.MessageCreate,
    /**
     *
     * @param {import("discord.js").Message} message
     */
    execute: async (message) => {
      if (!checkMessageAudio(message)) return;
      await message.channel.sendTyping();
      try {
        let audioObject;
        let factorString = message.content.split(" ")[1];
        if (!factorString) {
          message.reply(
            "Include a number to indicate the magnitude of the effect."
          );
        }
        let factor = Number.parseFloat(factorString);
        if (message.reference) {
          const m = await message.channel.messages.fetch(
            message.reference.messageId
          );
          console.log(m);
          audioObject = await getAudioObject(m);
          console.log("AUDIO OBJECT:", audioObject);
        } else {
          const messages = await message.channel.messages.fetch({ limit: 50 });
          for (const [id, currentMessage] of messages) {
            try {
              if (
                currentMessage.attachments &&
                currentMessage.attachments.size > 0
              ) {
                audioObject = await getAudioObject(currentMessage);
                console.log("AUDIO OBJECT:", audioObject);
                break;
              }
            } catch (error) {
              console.log(error);
            }
          }
          if (!audioObject) {
            message.reply(
              "No audio files were found. If this isn't true, bother Jade about it."
            );
          }
        }
        let changed;
        console.log(factor);
        if (message.content.startsWith("$loop")) {
          changed = await loopAudio({
            fileName: audioObject,
            times: factor,
          });
        }
        if (message.content.startsWith("$pitch")) {
          changed = await pitchShiftAudio({
            fileName: audioObject,
            factor: factor,
          });
        }
        if (message.content.startsWith("$tempo")) {
          changed = await stretchAudio({
            fileName: audioObject,
            factor: factor,
          });
        }
        message.reply({
          content: "edited audio: ",
          files: [changed],
        });
        return;
      } catch (error) {
        console.log(error);
      }
    },
    once: false,
  },
];
