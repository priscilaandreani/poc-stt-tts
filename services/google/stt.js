import { SpeechClient } from "@google-cloud/speech";

const sttClient = new SpeechClient();
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./google-credentials.json";

export async function speechToTextWithGoogle(gcsUri) {
  try {
    const request = {
      audio: {
        uri: gcsUri,
      },
      config: {
        encoding: "MP3",
        sampleRateHertz: 16000,
        languageCode: "pt-BR",
      },
    };

    const [response] = await sttClient.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    console.log(`Transcrição: ${transcription}`);
    return transcription;
  } catch (error) {
    console.error("Erro ao transcrever áudio com Google STT:", error);
    throw error;
  }
}

(async () => {
  await speechToTextWithGoogle(
    "gs://poc-stt-and-tts/test_google_tts-withSSML.mp3"
  );
})();
