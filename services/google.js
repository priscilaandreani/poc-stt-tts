import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import fs from "node:fs";

const ttsClient = new TextToSpeechClient();
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./google-credentials.json";

export async function textToSpeechWithGoogle(text, outputFile) {
  try {
    const options = {
      input: { ssml: text },
      voice: { languageCode: "pt-BR", ssmlGender: "FEMALE" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const data = await ttsClient.synthesizeSpeech(options);

    fs.writeFileSync(outputFile, data[0].audioContent, "binary");

    return outputFile;
  } catch (error) {
    console.error("Erro ao sintetizar fala com Google TTS:", error);
    throw error;
  }
}

const ssmlInput =
  '<speak>Olá. <break time="1s"/> Esta é uma fala com uma pausa dramática.</speak>';

(async () => {
  await textToSpeechWithGoogle(
    ssmlInput,
    "output/test_google_tts-withSSML.mp3"
  );
})();
