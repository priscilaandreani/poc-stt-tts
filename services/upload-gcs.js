import { Storage } from "@google-cloud/storage";
import path from "node:path";

const storage = new Storage();
process.env.GOOGLE_APPLICATION_CREDENTIALS = "./google-credentials.json";

/**
 * Faz o upload de um arquivo local para um bucket do Google Cloud Storage.
 * @param {string} bucketName O nome do bucket de destino.
 * @param {string} filePath O caminho local do arquivo a ser enviado.
 */
async function uploadToGCS(bucketName, filePath) {
  const destFileName = path.basename(filePath);

  console.log(
    `Iniciando upload de ${filePath} para gs://${bucketName}/${destFileName}...`
  );

  const [file] = await storage.bucket(bucketName).upload(filePath, {
    destination: destFileName,
  });

  const gcsUri = `gs://${bucketName}/${destFileName}`;
  console.log(`✅ Upload concluído! URI do GCS: ${gcsUri}`);

  return gcsUri;
}

const localAudioFile = "output/test_google_tts-withSSML.mp3";
const bucketName = "poc-stt-and-tts";

(async () => {
  uploadToGCS(bucketName, localAudioFile).catch(console.error);
})();
