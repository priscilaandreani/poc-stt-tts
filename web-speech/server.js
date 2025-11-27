import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// --- API Mockada - Simulando respostas do Bedrock ---
app.post("/api/chat", (req, res) => {
  console.log(req);
  console.log(res);

  const userText = req.body.text ? req.body.text.toLowerCase() : "";
  console.log(`📩 Recebido: "${userText}"`);

  let botResponse = "Desculpe, não entendi. Pode repetir?";

  if (userText.includes("olá") || userText.includes("oi")) {
    botResponse = "Olá! Eu sou seu assistente virtual. Como posso ajudar?";
  } else if (userText.includes("perfume") || userText.includes("boticário")) {
    botResponse =
      "O produto mais vendido do Boticário é o Malbec. Gostaria de saber mais?";
  } else if (userText.includes("cabelo")) {
    botResponse =
      "Temos várias linhas de cuidados para cabelo. Você conhece o Siáge?";
  } else if (userText.includes("tchau")) {
    botResponse = "Até logo! Foi um prazer falar com você.";
  }

  setTimeout(() => {
    res.json({ reply: botResponse });
  }, 500);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
