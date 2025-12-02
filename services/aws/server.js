import express from "express";
import cors from "cors";
import path from "node:path";
import { config } from "dotenv";

import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

const app = express();
const PORT = 3000;

// Configuração AWS Polly
config();
const region = process.env.AWS_REGION || "us-east-1";
const pollyClient = new PollyClient({ region });

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.static("public"));

// Mock do Bedrock Agent com respostas programadas
function mockBedrockAgent(text) {
  const userText = text.toLowerCase();
  console.log(`📩 Recebido: "${userText}"`);

  if (userText.includes("olá") || userText.includes("oi")) {
    return "Olá! Eu sou seu assistente virtual do Boticário. Como posso ajudar?";
  }
  if (userText.includes("perfume") || userText.includes("boticário")) {
    return "O produto mais vendido do Boticário é o Malbec. Gostaria de saber mais?";
  }
  if (userText.includes("promoção")) {
    return "Temos uma promoção especial de 20% para pagamentos à vista.";
  }
  if (userText.includes("cabelo")) {
    return "Temos várias linhas de cuidados para cabelo. Você conhece o Siáge?";
  }
  if (userText.includes("tchau")) {
    return "Até logo! Foi um prazer falar com você.";
  }

  return `Você disse: "${text}". Não tenho uma resposta programada para isso, mas veja como minha voz é natural!`;
}

// AWS POLLY
async function synthesizeAudio(text) {
  const command = new SynthesizeSpeechCommand({
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Camila",
    Engine: "neural",
    LanguageCode: "pt-BR",
  });

  const response = await pollyClient.send(command);

  // Stream da AWS -> Buffer Node.js
  const chunks = [];
  for await (const chunk of response.AudioStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

app.post("/api/chat", async (req, res) => {
  try {
    const userText = req.body.text || "";
    console.log(`🎤 Recebido do Browser: "${userText}"`);

    const agentText = mockBedrockAgent(userText);

    // Pode levar ~500ms a 1s dependendo do tamanho do texto
    const audioBuffer = await synthesizeAudio(agentText);
    console.log(`🔊 Áudio gerado pela Polly (${audioBuffer.length} bytes)`);

    res.json({
      text: agentText,
      audio: audioBuffer.toString("base64"),
    });
  } catch (error) {
    console.error("🔥 Erro no Backend:", error);
    res.status(500).json({
      text: "Erro ao gerar voz.",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor Híbrido rodando em http://localhost:${PORT}`);
});
