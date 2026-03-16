const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 👉 把这里换成你的阿里云 DashScope API Key
const API_KEY = "sk-cced2abb83df4806965ab9647a4f80f2";

// AI 对话接口（前端会访问这里）
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
      {
        model: "qwen-turbo",
        input: {
          messages: [
            { role: "user", content: message }
          ]
        },
        parameters: {
          temperature: 0.7
        }
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.output.text;
    res.json({ success: true, reply });

  } catch (err) {
    console.error("调用千问失败：", err.response?.data || err.message);
    res.json({
      success: false,
      reply: "AI暂时无法回答，请稍后再试"
    });
  }
});

app.listen(PORT, () => {
  console.log(`后端已启动：http://localhost:${PORT}`);
});