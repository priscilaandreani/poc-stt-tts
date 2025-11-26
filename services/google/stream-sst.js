import { SpeechClient } from "@google-cloud/speech";
import fs from "node:fs";

const sttClient = new SpeechClient();
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./google-credentials.json";

/**
 * Transcreve um arquivo de áudio local usando streaming.
 * @param {string} localFilePath O caminho para o arquivo de áudio.
 */
export async function streamSpeechToTextWithGoogle(localFilePath) {
  const initialRequest = {
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "pt-BR",
      model: "phone_call",
      interimResults: true, // Resultados provisórios
      interimResults: true, // Resultados em tempo real
      enableAutomaticPunctuation: true, // Pontuação automática
    },
  };

  const recognizeStream = sttClient
    .streamingRecognize(initialRequest)
    .on("error", (error) => {
      console.error("❌ Erro no Stream STT:", error);
    })
    .on("data", (data) => {
      const transcript = data.results[0].alternatives[0].transcript;

      if (data.results[0] && data.results[0].isFinal) {
        console.log(`✅ Transcrição Final: ${transcript}`);
      } else {
        console.log(`... Resultados Provisórios: ${transcript}`);
      }
    });

  const fileStream = fs.createReadStream(localFilePath);

  // Simula a entrada contínua do microfone.
  fileStream.pipe(recognizeStream);

  await new Promise((resolve) => recognizeStream.on("end", resolve));
}

// --- Exemplo de Uso ---
(async () => {
  const audioFile = "input/teste-01.wav";

  if (!fs.existsSync(audioFile)) {
    console.log(
      `Arquivo de áudio não encontrado em: ${audioFile}. Por favor, verifique o caminho.`
    );
    return;
  }

  console.log("Iniciando Transcrição em Tempo Real (Simulada)...");
  await streamSpeechToTextWithGoogle(audioFile);
})();
